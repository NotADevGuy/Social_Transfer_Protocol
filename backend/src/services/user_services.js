const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../models/user_model");
const Files = require("../models/file_model");
const FriendRequest = require("../models/friend_request");
const mongoose = require("mongoose");

router.post("/login", async (req, res) => {
    console.log(`\nLogin attempt on account ${req.body.email} with password ${req.body.password}`)
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        console.log("User does not exist!")
        return res.status(404).json({ message: "User does not exist!", status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        console.log("Password is incorrect!")
        return res.status(401).json({ message: "Incorrect password!", status: 401 });
    }

    console.log("Login successful!")
    return res.status(200).json({
        message: "Login successful!",
        userInfo: {
            id: user._id,
            username: user.username,
            name: user.name,
            email: user.email,
            friends: user.friends,
            files: user.files,
        }});
})

router.post("/register", async (req, res) => {
    const {username, password, email, name} = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);
    console.log(`\nAttempting registration of new user: ${email}`)

    const userEmail = await User.findOne({email})
    const userName = await User.findOne({username})

    if (userEmail || userName) {
        console.log("User already exists!")
        return res.status(403).json({message: "User already exists!", status: 403});
    }

    const newUser = new User({
        username: username, password: hashPass, email: email, name: name,
    })

    await newUser.save()
        .then(() => {
            console.log("User created successfully!")
            res.status(201).json({message: "User created successfully!", status: 201})
        })
        .catch((err) => {
            console.log("Error creating user!")
            res.status(500).json({message: "Error creating user!", status: 500})
        });
})

router.post("/addfile", async (req, res) => {
    const filename = req.body.filename;
    const size = req.body.size;
    const extension = req.body.extension;
    const username = req.body.owner;
    console.log(`\nAttempting to add file to user ${username}`)

    const user = await User.findOne({username});

    if (!user) {
        console.log("User does not exist!")
        return res.status(404).json({message: "User does not exist!", status: 404})
    }

    const fileId = new mongoose.Types.ObjectId();

    const newFile = new Files({
        _id: fileId,
        name: filename,
        size: size,
        extension:extension,
        owner: user._id,
        ownerUsername: username
    })

    await newFile.save()
        .then(() => {
            console.log("File added successfully!")
        })
        .catch((err) => {
            console.log("Error adding file!")
            return res.status(500).json({message: "Error adding file!", status: 500})
        })

    user.files.push({
        name: filename,
        file: fileId._id
    });

    await user.save()
        .then(() => {
            console.log("File added to user successfully!")
            return res.status(201).json({message: "File added to user successfully!", status: 201})
        })
        .catch((err) => {
            console.log("Error adding file to user!")
            return res.status(500).json({message: "Error adding file to user!", status: 500})
        })
})

router.post("/removefile", async (req, res) => {
    const {id, username, filename} = req.body;
    const file = await Files.findOne({name: filename, ownerUsername: username});
    const user = await User.findOne({username});

    if (!file) {
        console.log(" MEW")
        return res.status(407).json({message: "File does not exist!", status: 407})
    }
    if (!user) {
        return res.status(407).json({message: "User does not exist!", status: 407})
    }

    try {
        file.deleteOne()
        user.files.pull(id)
    } catch (err) {
        console.log(err)
    }

    await file.save()
        .catch((err) => {
            console.log("Error removing file! LOC1")
            return res.status(500).json({message: "Error removing file!", status: 500})
        })
    await user.save()
        .catch((err) => {
            console.log("Error removing file! LOC2")
            return res.status(500).json({message: "Error removing file!", status: 500})
        })
    return res.status(200).json({message: "File removed successfully!", status: 200})
})

router.post("/updateIP", async (req, res) => {
    const { username, ip } = req.body;
    console.log(`\nAttempting to update IP of user ${username}`)
    const user = await User.findOne({username});
    if (!user) {
        return res.status(404).json({message: "User does not exist!", status: 404})
    }
    await user.updateOne({address: ip})
        .then(() => {
            console.log("IP updated successfully!")
            return res.status(201).json({message: "IP updated successfully!", status: 201})
        })
        .catch((err) => {
            console.log("Error updating IP!")
            return res.status(500).json({message: "Error updating IP!", status: 500})
        })
})

router.get("/getIP/:username", async (req, res) => {
    const {username} = req.params;
    console.log(`\nAttempting to get IP of user ${username}`)
    const user = await User.findOne({username});
    if (!user) {
        console.log("User does not exist!")
        return res.status(404).json({message: "User does not exist!", status: 404})
    }
    if (!user.address) {
        console.log("User is offline!")
        return res.status(404).json({message: "User is offline!", status: 404})
    }
    return res.status(200).json({ip: user.address, status: 200})
})

router.get("/get/:username", async (req, res) => {
    const {username} = req.params;
    const profile = await User.findOne({username})
    if (!profile) {
        return res.status(404).json({message: "User does not exist!", status: 404})
    }
    return res.status(200).json({
        profile: {
            username: profile.username,
            name: profile.name,
            email: profile.email,
            friends: profile.friends,
            files: profile.files,
        }});
})

router.get('/search', async (req, res) => {
    const { query } = req.query;

    try {
        const files = await Files.find({ name: { $regex: query, $options: 'i' } });
        const users = await User.find({ $or: [
                { name: { $regex: query, $options: 'i' } },
                { username: { $regex: query, $options: 'i' } }
            ]});
        res.json({ files, users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post("/addfriend", async (req, res) => {
    console.log("attempting")
    const {sender, recipient} = req.body;

    const userSender = await User.findOne({username: sender});
    const userRecipient = await User.findOne({username: recipient});
    if (!userSender || !userRecipient) {
        return res.status(404).json({message: "One of you don't exist!", status: 404})
    }
    const friendRequest = new FriendRequest({sender: userSender, receiver: userRecipient});

    await friendRequest.save()
        .then(() => {
            return res.status(201).json({message: "Friend request sent!", status: 201});
        })
        .catch((err) => {
            return res.status(500).json({message: "Error sending friend request!", status: 500});
        })
})

router.get("/getfriendrequests/:username", async (req, res) => {
    const {username} = req.params;
    const user = await User.findOne({username: username})
    const requests = await FriendRequest.find({receiver: user._id })
        .populate("sender", "username")
    return res.status(200).json({requests: requests})
})

router.post("/acceptfriendrequest", async (req, res) => {
    const { id } = req.body;
    const foundRequest = await FriendRequest.findOne({_id: id})
        .catch((err) => {
            console.log(err)
            return res.status(500).json({message: "Error in accepting friend", status: 500})
        })

    const userSender = await User.findOne({_id: foundRequest.sender._id}).populate("friends.user", "username")
    const userReceiver = await User.findOne({_id: foundRequest.receiver._id}).populate("friends.user", "username")

    if (!userSender || !userReceiver) {
        return res.status(404).json({message: "One of you don't exist!", status: 404})
    }

    console.log(userSender.username, userReceiver.username)
    userSender.updateOne({$push: {friends: {user: userReceiver._id, username: userReceiver.username} }})
        .catch((err) => {
            console.log("Err in userSender.updateOne")
            return res.status(500).json({message: "Error in accepting friend", status: 500})
        })

    userReceiver.updateOne({$push: {friends: {user: userSender._id, username: userSender.username}}})
        .catch((err) => {
            console.log("Err in userReceiver.updateOne")
            return res.status(500).json({message: "Error in accepting friend", status: 500})
        })

    await FriendRequest.deleteOne({_id: id})
        .then(() => {
            console.log("Friend request deleted!")
            return res.status(200).json({message: "Friend request accepted!", status: 200})
        })
        .catch((err) => {
            console.log("Err in foundRequest.deleteOne")
            return res.status(500).json({message: "Error in accepting friend", status: 500})
        })

})

router.post("/declinefriendrequest", async (req, res) => {
    const { id } = req.body;
    await FriendRequest.findOneAndDelete({_id: id})
        .then((request) => {
            return res.status(200).json({message: "Friend request declined!", status: 200})
        })
        .catch((err) => {
            return res.status(500).json({message: "Error declining friend request!", status: 500})
        })
})

module.exports = router;