import { Avatar, Button, IconButton } from "@material-ui/core";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DonutLargeRoundedIcon from "@material-ui/icons/DonutLargeRounded";
import styled from "styled-components";
import SearchIcon from "@material-ui/icons/Search";
import Chat from "./Chat";
import { useCollection } from "react-firebase-hooks/firestore";
import * as EmailValidator from "email-validator";
import { useRouter } from "next/router";

function Sidebar() {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const userChatsRef = db
    .collection("chats")
    .where("users", "array-contains", user.email);
  const [chatsSnapshot] = useCollection(userChatsRef);

  const createChat = () => {
    const input = prompt(
      "Please enter an email address for the user you wish to chat with"
    );

    if (!input) return;

    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExist(input) &&
      input !== user.email
    ) {
      db.collection("chats").add({
        users: [user.email, input],
      });
    }
  };

  const chatAlreadyExist = (recipientEmail) =>
    !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );

  return (
    <Container>
      <Header>
        <UserAvatar onClick={() => auth.signOut()} src={user.photoURL} />

        <IconsContainer>
          <IconButton onClick={() => router.push("/users")}>
            <DonutLargeRoundedIcon style={{ color: "#B1B3B5" }} />
          </IconButton>
          <IconButton onClick={() => router.push("/users")}>
            <ChatIcon style={{ color: "#B1B3B5" }} />
          </IconButton>
          <IconButton>
            <MoreVertIcon style={{ color: "#B1B3B5" }} />
          </IconButton>
        </IconsContainer>
      </Header>

      <SearchContainer>
        <Search>
          <SearchIcon style={{ color: "#B1B3B5" }} />
          <SearchInput placeholder="Search in chats" type="text" />
        </Search>
      </SearchContainer>

      <SidebarButton onClick={createChat}>Start a new chat</SidebarButton>

      {/* Components */}
      <ChatContainer>
        {chatsSnapshot?.docs.map((chat) => (
          <Chat key={chat.id} id={chat.id} users={chat.data().users} />
        ))}
      </ChatContainer>
    </Container>
  );
}

export default Sidebar;

const Container = styled.div`
  flex: 0.45;
  border-right: 0.5px solid #262d31;
  height: 100vh;
  min-width: 300px;
  max-width: 400px;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;

const SidebarButton = styled(Button)`
  width: 100%;
  &&& {
    border-top: 0.5px solid #262d31;
    border-bottom: 0.5px solid #262d31;
    background-color: #2a2f32;
    color: white;
    border-radius: 0px !important;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #131c21;
  padding: 10px;
  border-bottom: 0.5px solid #262d31;
`;

const Search = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  background-color: #32373a;
  padding: 10px;
  width: 340px;
`;

const SearchInput = styled.input`
  outline-width: 0;
  border: none;
  flex: 1;
  margin-left: 10px;
  background-color: transparent;
`;

const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  background-color: #2a2f32;
`;

const IconsContainer = styled.div``;

const ChatContainer = styled.div`
  background-color: #131c21;
  min-height: 100vh;
`;
