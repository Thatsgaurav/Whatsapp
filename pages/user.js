import { Avatar, Button, IconButton } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import styled from "styled-components";
import { useRouter } from "next/router";
import * as EmailValidator from "email-validator";
import { useCollection } from "react-firebase-hooks/firestore";

function Users() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [user] = useAuthState(auth);

  const userChatsRef = db
    .collection("chats")
    .where("users", "array-contains", user.email);
  const [chatsSnapshot, loading] = useCollection(userChatsRef);

  useEffect(() => {
    db.collection("users")
      .orderBy("name")
      .onSnapshot((snapshot) =>
        setUsers(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
  }, []);

  const createChat = (input) => {
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
        <IconButton onClick={() => router.push("/")}>
          <ArrowBackIcon style={{ color: "white" }} />
        </IconButton>
      </Header>
      {users.map(({ id, data: { name, email, photoURL } }) => (
        <div
          onClick={(e) => {
            e.preventDefault();
            createChat(email);
          }}
        >
          {email === user.email ? (
            <div></div>
          ) : (
            <UsersList>
              <UserAvatar src={photoURL} />
              <UserDetails
                onClick={() => {
                  router.push("/");
                  alert("Chat created successfully");
                }}
              >
                <UserEmail>{email}</UserEmail>
                <UserName>{name}</UserName>
              </UserDetails>
            </UsersList>
          )}
        </div>
      ))}
    </Container>
  );
}

export default Users;

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
  border-bottom: 0.5px solid #262d31;
  background-color: #323739;
`;

const UsersList = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  word-break: break-word;
  background-color: #131c21;
  color: white;
  :hover {
    background-color: #2d3134;
  }
`;

const UserDetails = styled.div`
  display: flex;
  cursor: pointer;
  word-break: break-word;
  flex-direction: column;
  margin-left: 10px;
`;

const UserAvatar = styled(Avatar)`
  align-items: flex-start;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;

const UserEmail = styled.div``;
const UserName = styled.div``;
