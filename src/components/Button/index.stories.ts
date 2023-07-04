import { Meta, StoryObj } from "@storybook/react";
import Button from ".";

const meta: Meta<typeof Button> = {
  component: Button,
  title: "/ui/components/CustomButton",
};

export default meta;

type ButtonStory = StoryObj<typeof Button>;

export const Primary: ButtonStory = {
  args: {
    appliedStyle: "primary",
    label: "Primary Button",
  },
};

export const Variant: ButtonStory = {
  args: {
    appliedStyle: "variant",
    label: "Variant Button",
  },
};
