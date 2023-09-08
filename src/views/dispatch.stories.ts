import { Meta, StoryObj } from "@storybook/react";
// import { userEvent, within } from "@storybook/testing-library";
import DispatchView from "./dispatch";

const meta: Meta<typeof DispatchView> = {
  component: DispatchView,
  title: "/views/DispatchView",
};

export default meta;

type DispatchViewStory = StoryObj<typeof DispatchView>;

export const Main: DispatchViewStory = {
  args: {
    mapsApiKey: process.env.STORYBOOK_MAPS_API_KEY as string,
    environment: "dev",
    apiKey: "9pUEsdGItGffGzTK2dDqQxqjl9rHJsAzB2jJ2Pw2TcOKETBLXF4ILtE0XKr9",
  },
  // play: async ({ canvasElement }) => {
  //   const cv = within(canvasElement);
  //   const button = await cv.findByRole("button", { hidden: true });
  //   userEvent.click(button);
  // }
};
