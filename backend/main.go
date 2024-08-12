package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/gorilla/websocket"
	_ "github.com/mattn/go-sqlite3"
	"github.com/skip2/go-qrcode"
	"go.mau.fi/whatsmeow"
	"go.mau.fi/whatsmeow/proto/waE2E"
	"go.mau.fi/whatsmeow/store/sqlstore"
	"go.mau.fi/whatsmeow/types/events"
	waLog "go.mau.fi/whatsmeow/util/log"
	"google.golang.org/protobuf/proto"
)

var (
	client   *whatsmeow.Client
	upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
	connections []*websocket.Conn
)

func eventHandler(evt interface{}) {
	switch v := evt.(type) {
	case *events.Message:
		fmt.Println("Received a message from", v.Info.PushName, ":", v.Message.GetConversation())

		reply := &waE2E.Message{
			Conversation: proto.String(".❤️."),
		}

		if v.Info.PushName == "arben" {
			params := &whatsmeow.GetProfilePictureParams{
				Preview:     true,
				ExistingID:  v.Info.ID,
				IsCommunity: false,
			}
			pic, err := client.GetProfilePictureInfo(v.Info.Sender, params)
			if err != nil {
				fmt.Println("Failed to get profile picture:", err)
			}

			msg := map[string]interface{}{
				"message": v.Message.GetConversation(),
				"sender":  v.Info,
				"pic":     pic.URL,
			}

			// Send the message to all connected WebSocket clients
			for _, conn := range connections {
				msgBytes, err := json.Marshal(msg)
				if err != nil {
					fmt.Println("Failed to marshal message:", err)
					return
				}
				err = conn.WriteMessage(websocket.TextMessage, msgBytes)
				if err != nil {
					fmt.Println("Failed to send message via WebSocket:", err)
				}
				if err != nil {
					fmt.Println("Failed to send message via WebSocket:", err)
				}
			}

			print("Message from Sofia Duarte Almeida: ", reply)
		}
	}
}

func wsHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Failed to upgrade to WebSocket:", err)
		return
	}
	fmt.Println("WebSocket connection established")
	connections = append(connections, conn)

	go func() {
		defer func() {
			conn.Close()
			// Remove the connection from the list
			for i, c := range connections {
				if c == conn {
					connections = append(connections[:i], connections[i+1:]...)
					break
				}
			}
		}()
		for {
			_, _, err := conn.ReadMessage()
			if err != nil {
				fmt.Println("WebSocket read error:", err)
				return
			}
		}
	}()
}

func main() {
	http.HandleFunc("/ws", wsHandler)
	go func() {
		fmt.Println("Starting WebSocket server on :3000")
		if err := http.ListenAndServe(":3000", nil); err != nil {
			fmt.Println("WebSocket server failed:", err)
		}
	}()

	dbLog := waLog.Stdout("Database", "DEBUG", true)
	container, err := sqlstore.New("sqlite3", "file:usersdb.db?_foreign_keys=on", dbLog)
	if err != nil {
		panic(err)
	}

	deviceStore, err := container.GetFirstDevice()
	if err != nil {
		panic(err)
	}

	clientLog := waLog.Stdout("Client", "DEBUG", true)
	client = whatsmeow.NewClient(deviceStore, clientLog)
	client.AddEventHandler(eventHandler)

	if client.Store.ID == nil {
		qrChan, _ := client.GetQRChannel(context.Background())

		go func() {
			for evt := range qrChan {
				if evt.Event == "code" {
					err := qrcode.WriteFile(evt.Code, qrcode.Medium, 256, "qr.png")
					if err != nil {
						fmt.Println("Failed to generate QR code:", err)
					} else {
						fmt.Println("QR code generated and saved as qr.png")
					}
					fmt.Println("Scan the QR code to log in:", evt.Code)
				} else {
					fmt.Println("Login event:", evt.Event)
				}
			}
		}()

		err = client.Connect()
		if err != nil {
			panic(err)
		}
	} else {
		err = client.Connect()
		if err != nil {
			panic(err)
		}
	}

	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)
	<-c

	client.Disconnect()
	fmt.Println("Client disconnected gracefully")
}
