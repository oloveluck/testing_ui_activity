import React from "react";
import { RenderResult, waitFor } from "@testing-library/react";
import { render } from "./test-utils";
import { TodoApp, TodoItemComponent } from "./TodoApp";
import  userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";

describe("TodoApp", () => {
  let renderedComponent: RenderResult;
  let newItemTextField: HTMLInputElement;
  let newItemButton: HTMLElement;
  let deleteAllButton: HTMLElement;

  const getTodoItemByTitle = (title: string) =>
    renderedComponent.getByText(title);

  beforeEach(() => {
    renderedComponent = render(<TodoApp />);
    newItemTextField = renderedComponent.getByPlaceholderText(
      "Put TODO description here"
    ) as HTMLInputElement;
    newItemButton = renderedComponent.getByRole("button", {
      name: "Add TODO item",
    }) ;
    deleteAllButton = renderedComponent.getByTestId("deleteAllButton");
  });
  describe("Adding todo items", () => {
    it("Adds the specified todo item to the list", async () => {
      userEvent.type(newItemTextField, "Write a better test input");
      userEvent.click(newItemButton);
      const todoItem = await renderedComponent.findByTestId("todoItem");
      expect(todoItem).toHaveTextContent(
        "Write a better test input"
      );
    });

    it("Adds the specified todo item to the list and wait for component to be added", async () => {
      userEvent.type(newItemTextField, "Write a better test input");
      userEvent.click(newItemButton);
      await waitFor(() => getTodoItemByTitle("Write a better test input"));
    });
  });
});

describe("TodoItemComponent Anti-pattern (rely on testId)", () => {
  let mockDeleteItem = jest.fn();

  let renderedComponent: RenderResult;
  let itemTitleText: string;
  beforeEach(() => {
    itemTitleText = "Some Todo Item";
    renderedComponent = render(
      <TodoItemComponent
        item={{ title: itemTitleText, id: 'someID' }}
        deleteItem={mockDeleteItem}
      />
    );
    mockDeleteItem.mockClear();
  });
  it("Displays the item title exactly as specified", () => {
    expect(renderedComponent.getByTestId("todoItem")).toHaveTextContent(
      itemTitleText
    );
  });
  it("Calls the deleteItem handler when the delete button is clicked", () => {
    userEvent.click(renderedComponent.getByTestId("deleteItem"));
    expect(mockDeleteItem).toHaveBeenCalled();
  });
});

describe("TodoItemComponent", () => {
  let itemTitleText: string;
  let renderedComponent: RenderResult;
  let mockDeleteItem = jest.fn();
  beforeEach(() => {
    itemTitleText = "Some Todo Item";
    renderedComponent = render(
      <TodoItemComponent
        item={{ title: itemTitleText, id: 'someID' }}
        deleteItem={mockDeleteItem}
      />
    );
    mockDeleteItem.mockClear();
  });
  it("Displays the item title exactly as specified", () => {
    expect(renderedComponent.getByText(itemTitleText)).toBeDefined();
  });
  it("Calls the deleteItem handler when the delete button is clicked", () => {
    userEvent.click(renderedComponent.getByLabelText("delete"));
    expect(mockDeleteItem).toHaveBeenCalled();
  });
});
