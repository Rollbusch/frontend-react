import { useEffect, useState } from "react";
import PersonList from "./components/PersonList";
import Container from "./components/Container";

export default function Home() {
  
  return (
    <>
      <main>
        <Container>
          <PersonList />
        </Container>
      </main>
    </>
  );
}
