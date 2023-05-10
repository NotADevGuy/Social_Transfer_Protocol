package stp;

import javafx.application.Application;
import javafx.application.Platform;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.TextField;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Pane;
import javafx.scene.text.Text;
import javafx.stage.Stage;

import static javafx.application.Application.launch;
import javafx.scene.control.TextArea;
import javafx.scene.layout.VBox;

public class STPGui extends Application {

    FTPServer server = null;
    FTPClient client = null;

    @Override
    public void start(Stage primaryStage) {

        //Text
        Text title = new Text("Welcome to the STP Service!");

        //Panes
        Pane rootMenu = new Pane();
        Pane rootClient = new Pane();
        Pane rootServer = new Pane();
        Pane Title = new Pane();
        HBox titleOptions = new HBox();
        HBox serverControl = new HBox();
        HBox serverOptions = new HBox();
        VBox clientOptions = new VBox();
        HBox clientRequest = new HBox();
        HBox clientHostFindPane = new HBox();
        VBox clientControl = new VBox();
        Pane serverConsole = new Pane();
        Pane clientConsole = new Pane();

        //Scene Setup
        Scene Menu = new Scene(rootMenu, 650, 550);
        Scene clientScene = new Scene(rootClient, 650, 550);
        Scene serverScene = new Scene(rootServer, 650, 550);

        //Buttons
        Button hostServerMenu = new Button();
        Button connectToServer = new Button();
        Button quit = new Button();
        Button serverEndConnect = new Button();
        Button clientEndConnect = new Button();
        Button requestFile = new Button();
        Button switchServer = new Button();
        Button switchClient = new Button();
        Button startHosting = new Button();
        Button clientFindHost = new Button();

        //TextFields
        TextField fileName = new TextField();
        fileName.setPromptText("Enter a file name.");
        TextField IPName = new TextField();
        IPName.setPromptText("Enter an IP address.");

        //Text Areas/Console
        TextArea serverSpeak = new TextArea();
        serverSpeak.setEditable(false);
        serverSpeak.setPrefWidth(630);
        serverSpeak.setPrefHeight(200);
        TextArea clientSpeak = new TextArea();
        clientSpeak.setEditable(false);
        clientSpeak.setPrefWidth(630);
        clientSpeak.setPrefHeight(200);

        //actions
        hostServerMenu.setText("Host");
        hostServerMenu.setOnAction(new EventHandler<ActionEvent>() {
            @Override
            public void handle(ActionEvent event) {
                primaryStage.setScene(serverScene);
                server = new FTPServer();
            }
        });
        connectToServer.setText("Connect To Host");
        connectToServer.setOnAction(new EventHandler<ActionEvent>() {
            @Override
            public void handle(ActionEvent event) {
                primaryStage.setScene(clientScene);
                client = new FTPClient();
            }
        });
        quit.setText("Quit");
        quit.setOnAction(new EventHandler<ActionEvent>() {
            @Override
            public void handle(ActionEvent event) {
                Platform.exit();
            }
        });
        requestFile.setText("Request");
        requestFile.setOnAction(new EventHandler<ActionEvent>() {
            @Override
            public void handle(ActionEvent event) {
                client.name = "GET " + fileName.getText();
                client.getFile();
                clientSpeak.appendText(client.console);
            }
        });
        clientEndConnect.setText("Disconnect");
        clientEndConnect.setOnAction(new EventHandler<ActionEvent>() {
            @Override
            public void handle(ActionEvent event) {
                client.disconnect();
                client = null;
                primaryStage.setScene(Menu);
            }
        });
        serverEndConnect.setText("Disconnect");
        serverEndConnect.setOnAction(new EventHandler<ActionEvent>() {
            @Override
            public void handle(ActionEvent event) {
                server.disconnect();
                server = null;
                primaryStage.setScene(Menu);
            }
        });
        switchClient.setText("Switch");
        switchClient.setOnAction(new EventHandler<ActionEvent>() {
            @Override
            public void handle(ActionEvent event) {
                client.disconnect();
                client = null;
                primaryStage.setScene(serverScene);
                server = new FTPServer();
            }
        });
        switchServer.setText("Switch");
        switchServer.setOnAction(new EventHandler<ActionEvent>() {
            @Override
            public void handle(ActionEvent event) {
                server.disconnect();
                server = null;
                primaryStage.setScene(clientScene);
                client = new FTPClient();
            }
        });
        startHosting.setText("Start Hosting");
        startHosting.setOnAction(new EventHandler<ActionEvent>() {
            @Override
            public void handle(ActionEvent event) {
                server.host();
            }
        });
        clientFindHost.setText("Find");
        clientFindHost.setOnAction(new EventHandler<ActionEvent>() {
            @Override
            public void handle(ActionEvent event) {
                client.ipAddr = IPName.getText();
                client.connect();
                clientSpeak.appendText(client.console);
            }
        });

        //Pane Setup
        Title.getChildren().add(title);
        Title.setLayoutX(225);
        Title.setLayoutY(100);

        titleOptions.getChildren().addAll(hostServerMenu, connectToServer, quit);
        titleOptions.setLayoutX(160);
        titleOptions.setLayoutY(300);
        titleOptions.setSpacing(40);

        clientOptions.getChildren().addAll(switchClient, clientEndConnect);
        clientOptions.setLayoutX(540);
        clientOptions.setLayoutY(10);
        clientOptions.setSpacing(10);

        clientControl.getChildren().addAll(clientHostFindPane, clientRequest);
        clientHostFindPane.getChildren().addAll(IPName, clientFindHost);
        clientHostFindPane.setSpacing(5);
        clientRequest.getChildren().addAll(fileName, requestFile);
        clientRequest.setSpacing(5);
        clientControl.setLayoutX(10);
        clientControl.setLayoutY(10);
        clientControl.setSpacing(10);

        serverOptions.getChildren().addAll(switchServer, serverEndConnect);
        serverOptions.setLayoutX(200);
        serverOptions.setLayoutY(200);
        serverOptions.setSpacing(40);

        serverControl.getChildren().addAll(startHosting);

        serverConsole.getChildren().add(serverSpeak);
        serverConsole.setLayoutX(10);
        serverConsole.setLayoutY(300);
        clientConsole.getChildren().add(clientSpeak);
        clientConsole.setLayoutX(10);
        clientConsole.setLayoutY(300);

        //placing
        rootMenu.getChildren().add(Title);
        rootMenu.getChildren().add(titleOptions);
        rootServer.getChildren().add(serverOptions);
        rootServer.getChildren().add(serverControl);
        rootServer.getChildren().add(serverConsole);
        rootClient.getChildren().add(clientOptions);
        rootClient.getChildren().add(clientControl);
        rootClient.getChildren().add(clientConsole);

        primaryStage.setTitle("Social Transfer Protocol Service");
        primaryStage.setScene(Menu);
        primaryStage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }

}
