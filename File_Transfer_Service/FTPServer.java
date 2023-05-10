package stp;

import java.io.*;
import java.net.*;

public class FTPServer {

    //COMMAND
    ServerSocket servSock; // Server socket
    Socket csock = null;// Client socket
    BufferedReader in = null;
    PrintWriter out = null;
    int port = 1040; // Command port

    //DATA
    ServerSocket servSockD; // Server socket for data
    Socket csockD = null; // Client socket for data
    FileInputStream inD = null;
    BufferedOutputStream outD = null;
    File file;
    byte[] fileData;
    int pasvDPort = 1042; // Passive connection data port

    //Console
    String console;

    //Threads
    Thread online;

    public FTPServer() {
    }

    public void host() {
        System.out.println("Ready to accept connections");
        online = new Thread(() -> {
            try {
                servSock = new ServerSocket(port);

                csock = servSock.accept();
                System.out.println("User connected");
                in = new BufferedReader(new InputStreamReader(csock.getInputStream()));
                out = new PrintWriter(csock.getOutputStream(), true);

                while (true) {
                    send();
                }

            } catch (Exception e) {
                e.printStackTrace();
                console = "Error in finding a connection.";
            }
        });
        online.setDaemon(true);
        online.start();
    }

    public void disconnect() {
        try {
            in.close();
            out.close();
            inD.close();
            outD.close();
            csockD.close();
            servSockD.close();
            csock.close();
            servSock.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void send() {
        try {
            String cmdName = in.readLine();
            
            if (cmdName.equals("bye!"))
            {
                disconnect();
                host();
            }
            System.out.println(cmdName);

            String cmdSplitName[] = cmdName.split(" ");

            String name = cmdSplitName[1]; //File name hopefully
            String cmd = cmdSplitName[0]; //GET also hopefully

            System.out.println(cmd);
            if (cmd.equals("GET")) {
                try {
                    servSockD = new ServerSocket(pasvDPort);
                    csockD = servSockD.accept();

                    outD = new BufferedOutputStream(csockD.getOutputStream());
                    inD = new FileInputStream(".\\ServerFolder\\" + name);

                    byte[] buffer = new byte[1024];
                    int bytesRead;
                    while ((bytesRead = inD.read(buffer)) != -1) {
                        outD.write(buffer, 0, bytesRead);
                    }

                    System.out.println(name + " sent to connected User ");
                    console = name + " sent to connected User";

                    outD.flush();
                    outD.close();
                    inD.close();
                    servSockD.close();

                } catch (IOException e) {
                    System.out.print("");
                }
            }

            System.out.println("File Transfer Complete.");
            console = "File Transfer Complete.";
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}//end class
