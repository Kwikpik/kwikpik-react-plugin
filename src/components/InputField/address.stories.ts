import { Meta, StoryObj } from "@storybook/react";
// import { userEvent, within } from "@storybook/testing-library";
import { AddressInputField } from ".";

const meta: Meta<typeof AddressInputField> = {
  component: AddressInputField,
  title: "/ui/components/inputs/AddressInputField",
};

export default meta;

type AddressInputFieldStory = StoryObj<typeof AddressInputField>;

export const Main: AddressInputFieldStory = {
  args: {
    onAddressStringChanged: (address) => console.log(address),
    onCoordinatesGotten: (lat, lng) => console.log(lat, lng),
    placeholder: "Pickup address",
    mapsApiKey: process.env.STORYBOOK_MAPS_API_KEY as string,
  },
  // play: async ({ canvasElement }) => {
  //   const cv = within(canvasElement);
  //   const button = await cv.findByRole("button", { hidden: true });
  //   userEvent.click(button);
  // }
};
