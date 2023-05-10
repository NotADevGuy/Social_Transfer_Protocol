package stp;

import java.net.*;
import java.io.*;
import java.util.*;

//I made the files sent and downloaded have "_" behind their names to show change.
//The Server Folder is what the GET commands access. The Client Folder is what the PUT commands access. (In both PASV and PORT)
public class FTPClient {

    //Writer
    File file = null;
    BufferedWriter writer = null;
    Scanner kb = new Scanner(System.in);
    FileReader fr = null;

    //COMMAND
    Socket csock = null; // Client socket
    BufferedReader in = null;
    PrintWriter out = null;
    public String name;
    public String ipAddr;
    int port = 1040; // Command port

    //DATA
    Socket csockD = null; // Client socket for data
    InputStream inD = null;
    FileOutputStream outD = null;
    int pasvDPort = 1042; // Passive connection data port

    //Console
    String console;

    public FTPClient() {
    }

    public void connect() {
        try {
            csock = new Socket(ipAddr, port);
            console = "Connected to Host User\n";

            in = new BufferedReader(new InputStreamReader(csock.getInputStream()));
            out = new PrintWriter(csock.getOutputStream(), true);

        } catch (Exception e) {
            console = "Error, could not connect to a host\n";
        }
    }

    public void connectData() {
        try {
            csockD = new Socket(ipAddr, pasvDPort);

        } catch (Exception e) {
            console = "Error, could not connect to a host\n";
        }
    }

    public void disconnect() {
        try {
            out.println("bye!");
            inD.close();
            outD.flush();
            outD.close();
            csockD.close();
            in.close();
            out.close();
            csock.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void getFile() {
        try {
          //  out.println("230 OK");
            out.println(name);
            System.out.println(name);
            connectData();
            String res = "220 OK";//in.readLine();  //Even this way seems to work only first time
            switch (res) {

                case "220 OK":
                    try {

                        String tks[] = name.split(" ");
                        String onlyFileName = tks[1];

                        inD = csockD.getInputStream();
                        outD = new FileOutputStream(".\\ClientFolder\\" + onlyFileName);
                        byte[] buffer = new byte[1024];
                        int bytesRead;
                        while ((bytesRead = inD.read(buffer)) != -1) {
                            outD.write(buffer, 0, bytesRead);
                        }


                        console = onlyFileName + " has been downloaded to your computer!\n";

                    } catch (IOException e) {
                        System.out.println("Error in writing file to the client.");
                    }
                    break;
                default:
                    console = "Could not locate file.\n";
                    break;
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}//end class
