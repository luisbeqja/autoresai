package main

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"syscall"

	_ "github.com/mattn/go-sqlite3"
	"github.com/skip2/go-qrcode"
	"go.mau.fi/whatsmeow"
	"go.mau.fi/whatsmeow/proto/waE2E"
	"go.mau.fi/whatsmeow/store/sqlstore"
	"go.mau.fi/whatsmeow/types/events"
	waLog "go.mau.fi/whatsmeow/util/log"
	"google.golang.org/protobuf/proto"
)

// Global variable to hold the client
var client *whatsmeow.Client

func eventHandler(evt interface{}) {
	switch v := evt.(type) {
	case *events.Message:
		/*
				"Received a message!" -> v.Message.GetConversation()
			    "Username of the sender" -> v.Info.PushName)
				"Is the message from a group chat ?" -> v.Info.IsGroup
		*/

		fmt.Println("Received a message from", v.Info.PushName, ":", v.Message.GetConversation())

		reply := &waE2E.Message{
			//Conversation: proto.String("Hey " + v.Info.PushName + ", sorry i'm not available right now 😅. You can leave a message and I will get back to you as soon as possible. ❤️"),
			Conversation: proto.String(".❤️."),
		}

		// Send a reply only if the message is from Sofia Duarte Almeida (change the name to the one you want)
		if v.Info.PushName == "Sofia Duarte Almeida" {
			_, err := client.SendMessage(context.Background(), v.Info.Chat, reply)

			if err != nil {
				fmt.Println("Failed to send message:", err)
			} else {

				fmt.Println("Response message sent successfully.")
			}
		}
	}
}

func main() {
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
		// No ID stored, new login
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
		// Already logged in, just connect
		err = client.Connect()
		if err != nil {
			panic(err)
		}
	}

	// Listen for system signals to gracefully shut down
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)
	<-c

	client.Disconnect()
	fmt.Println("Client disconnected gracefully")
}
