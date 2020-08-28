import React, { useState, useEffect } from "react";
import { Alert } from "react-native";

import {
  Container,
  TypeTitle,
  TypeDescription,
  TypeImage,
  RequestButton,
  RequestButtonText,
} from "./styles";

import uberx from "../../assets/uberx.png";

function Details() {
  const [value, setValue] = useState(null);

  useEffect(() => {
    let price = Math.floor(Math.random() * (200 - 10) + 1000) / 100;
    setValue(price);
  }, []);

  return (
    <Container>
      <TypeTitle>Popular</TypeTitle>
      <TypeDescription>Viagens para o dia a dia</TypeDescription>

      <TypeImage source={uberx} />
      <TypeTitle>UberX</TypeTitle>
      <TypeDescription>{`R$ ${value}`}</TypeDescription>

      <RequestButton
        onPress={() => {
          return Alert.alert(
            "Viagem solicitada com sucesso!",
            "Obrigado por viajar conosco."
          );
        }}
      >
        <RequestButtonText>SOLICITAR UBERX</RequestButtonText>
      </RequestButton>
    </Container>
  );
}

export default Details;
