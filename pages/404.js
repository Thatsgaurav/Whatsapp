import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import Sidebar from "../components/Sidebar";

function Custom404() {
  const router = useRouter();
  return (
    <Container>
      <SidebarContainer>
        <Sidebar />
      </SidebarContainer>
      <ErrorRight>
        <h1>404</h1>
        <p>We couldn't find the page you are looking for</p>

        <Home onClick={() => router.push("/")}>Go back</Home>
      </ErrorRight>
    </Container>
  );
}

export default Custom404;

const Container = styled.div`
  display: flex;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;
const ErrorRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: white;
  height: 100%;
  margin: 20px;
  @media (min-width: 768px) {
    margin: 20vw;
  }
  > p {
    font-size: 35px;
  }
  > h1 {
    font-size: 50px;
  }
`;

const Home = styled.button`
  cursor: pointer;
  background-color: #131c21;
  border-radius: 10px;
  color: white;
  height: 100%;
  padding: 10px;
  outline: none;
  border: none;
  text-align: center;
  font-size: 40px;
`;

const SidebarContainer = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;
