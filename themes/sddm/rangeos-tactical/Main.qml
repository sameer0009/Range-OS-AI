import QtQuick 2.15
import QtQuick.Controls 2.15
import SddmComponents 2.0

Rectangle {
    id: container
    width: 1920
    height: 1080
    color: "#0F172A"

    Text {
        anchors.top: parent.top
        anchors.topMargin: 100
        anchors.horizontalCenter: parent.horizontalCenter
        text: "RANGEOS AI // MISSION CONTROL"
        color: "#38BDF8"
        font.pixelSize: 42
        font.family: "Inter"
        font.weight: Font.Black
        letterSpacing: 4
    }

    // Login Form Placeholder
    Rectangle {
        width: 400
        height: 300
        color: "#1E293B"
        radius: 12
        border.color: "#38BDF8"
        border.width: 1
        anchors.centerIn: parent
        opacity: 0.9

        Column {
            anchors.centerIn: parent
            spacing: 20

            TextField {
                placeholderText: "IDENTITY_ID"
                width: 320
            }

            TextField {
                placeholderText: "TACTICAL_KEY"
                echoMode: TextInput.Password
                width: 320
            }

            Button {
                text: "AUTH_COMMIT"
                width: 320
                background: Rectangle { color: "#38BDF8"; radius: 4 }
            }
        }
    }

    // Health Status Placeholder
    Text {
        anchors.bottom: parent.bottom
        anchors.right: parent.right
        anchors.margins: 40
        text: "INTELLIGENCE CORE: [ ONLINE ]"
        color: "#10B981"
        font.family: "Courier"
        font.pixelSize: 12
    }
}
