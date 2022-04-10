import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test('renders "Rintaro" word', () => {
  render(<App />);
  const elms = screen.getAllByText(/Rintaro/);
  elms.forEach((elm) => expect(elm).toBeInTheDocument());
});
