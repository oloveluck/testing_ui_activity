import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { AiFillHeart, AiOutlineDelete, AiOutlineHeart } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { nanoid } from "nanoid";

interface TodoItem {
  title: string;
  id: string;
}

interface FormContents {
  itemDesc: string;
}

export const TodoItemComponent: React.FunctionComponent<{
  item: TodoItem;
  deleteItem: () => void;
}> = ({ item, deleteItem }) => {
  const [isLiked, setLiked] = useState<boolean>(false);
  let likeButton;
  if (isLiked) {
    likeButton = (
      <IconButton
        aria-label="unlike"
        icon={<AiFillHeart />}
        onClick={() => {
          setLiked(false);
        }}
      />
    );
  } else {
    likeButton = (
      <IconButton
        aria-label="like"
        icon={<AiOutlineHeart />}
        onClick={() => setLiked(true)}
      />
    );
  }
  return (
    <HStack>
       <Text data-testid='todoItem'>{item.title}</Text>
       <Button onClick={deleteItem} data-testid='deleteItem' aria-label="delete">
         <AiOutlineDelete />
       </Button>
       {likeButton}
     </HStack>
   );
};
export const TodoApp = () => {
  const [items, setItems] = useState<TodoItem[]>([
  ]);

  const toast = useToast();
  const { register, handleSubmit, reset } = useForm<FormContents>();

  const addTodoItem = useCallback(
    (contents: FormContents) => {
      if (contents.itemDesc) {
        const newItem = { title: contents.itemDesc, id: nanoid() };
        setItems((oldItems) => oldItems.concat(newItem));
        reset();
      }
    },
    [setItems, reset]
  );

  const onSubmit = handleSubmit(addTodoItem);

  useEffect(() => {
    toast({
      title: "Your items have changed!!",
      status: "success",
      duration: 1000,
      isClosable: true,
    });
  }, [items, toast]);

  const deleteAllItems = useCallback(() => {
    setItems([]);
  }, [setItems]);

  return (
    <VStack>
      <Heading>TODO List</Heading>
      <Box>
        <Button color="red" data-testid="deleteAllButton" onClick={deleteAllItems}>
          Delete all items
        </Button>
      </Box>
      <form onSubmit={onSubmit}>
        <FormControl isRequired>
          <FormLabel>TODO item:</FormLabel>
          <Input
            placeholder="Put TODO description here"
            {...register("itemDesc")}
          />
        </FormControl>
        <Button type="submit">
          Add TODO item
        </Button>
      </form>
      {items.map((theItem) => (
        <TodoItemComponent
          item={theItem}
          key={theItem.id}
          deleteItem={() => {
            setItems((oldItems) => oldItems.filter((i) => i !== theItem));
          }}
        />
      ))}
    </VStack>
  );
};
