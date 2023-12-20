import { Meta, StoryObj } from "@storybook/react";
// import { userEvent, within } from "@storybook/testing-library";
import { FilePickingField } from ".";

const meta: Meta<typeof FilePickingField> = {
  component: FilePickingField,
  title: "/components/input-field/FilePicker",
};

export default meta;

type FilePickingFieldStory = StoryObj<typeof FilePickingField>;

export const Main: FilePickingFieldStory = {
  args: {},
  // play: async ({ canvasElement }) => {
  //   const cv = within(canvasElement);
  //   const button = await cv.findByRole("button", { hidden: true });
  //   userEvent.click(button);
  // }
};
