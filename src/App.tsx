import * as React from "react"
import {
  ChakraProvider,
  theme,
} from "@chakra-ui/react"

import { TodoApp } from "./TodoApp"

export const App = () => (
  <ChakraProvider theme={theme}>
    <TodoApp />
  </ChakraProvider>
)
