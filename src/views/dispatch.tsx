import React from "react";
import ViewBaseCard from "./Base";
import { AddressInputField, FilePickingField, NumberField, TextArea, TextField } from "../components/InputField";
import { FaSortNumericUpAlt, FaWeight } from "react-icons/fa";
import { GiPriceTag } from "react-icons/gi";
import { HiOutlineDocument } from "react-icons/hi";
import { FiPhone, FiUser } from "react-icons/fi";
import Button from "../components/Button";

interface CustomButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  onPress: React.MouseEventHandler<HTMLButtonElement>;
  disabled: boolean;
}

interface DispatchViewProps {
  customButton?: (props: CustomButtonProps) => React.ReactNode;
  mapsApiKey?: string;
}

export default function DispatchView({ customButton, mapsApiKey }: DispatchViewProps) {
  return (
    <ViewBaseCard>
      <div className="flex justify-center items-center w-full gap-6 flex-col">
        <span className="text-[#000] text-[1.5rem] capitalize font-[600]">create dispatch request</span>
        <div className="flex flex-col justify-start items-start gap-8 w-full overflow-auto">
          <div className="flex flex-col justify-start items-start gap-3 w-full">
            <span className="text-[#000] text-[1rem] capitalize font-[500]">locations</span>
            <div className="w-full flex justify-start items-center flex-col gap-4">
              <AddressInputField
                width="100%"
                placeholder="Pickup address"
                mapsApiKey={mapsApiKey as string}
                onAddressStringChanged={() => {}}
                onCoordinatesGotten={() => {}}
              />
              <AddressInputField
                width="100%"
                placeholder="Drop-off address"
                mapsApiKey={mapsApiKey as string}
                onAddressStringChanged={() => {}}
                onCoordinatesGotten={() => {}}
              />
            </div>
          </div>

          {/* <div className="flex flex-col justify-start items-start gap-3 w-full">
            <span className="text-[#000] text-[1rem] capitalize font-[500]">sender information</span>
            <div className="w-full flex justify-start items-center flex-col gap-4">
              <TextField width="100%" placeholder="Name (optional)" icon={<FiUser />} />
              <TextField width="100%" placeholder="Phone number (required)" icon={<FiPhone />} />
            </div>
          </div>

          <div className="flex flex-col justify-start items-start gap-3 w-full">
            <span className="text-[#000] text-[1rem] capitalize font-[500]">recipient information</span>
            <div className="w-full flex justify-start items-center flex-col gap-4">
              <TextField width="100%" placeholder="Name (optional)" icon={<FiUser />} />
              <TextField width="100%" placeholder="Phone number (required)" icon={<FiPhone />} />
            </div>
          </div> */}

          <div className="flex flex-col justify-start items-start gap-3 w-full">
            <span className="text-[#000] text-[1rem] capitalize font-[500]">package</span>
            <div className="w-full flex justify-start items-center flex-col gap-4">
              <NumberField width="100%" placeholder="Package weight in kg (optional)" icon={<FaWeight />} />
              <FilePickingField width="100%" placeholder="Package image (optional)" onFileSelected={() => {}} />
              <NumberField width="100%" placeholder="Quantity (optional)" icon={<FaSortNumericUpAlt />} />
              <NumberField width="100%" placeholder="Market price (optional)" icon={<GiPriceTag />} />
              <TextArea
                width="100%"
                height={200}
                placeholder="Package description (optional)"
                icon={<HiOutlineDocument />}
              />
            </div>
          </div>
          <Button label="Next" width="100%" />
        </div>
      </div>
    </ViewBaseCard>
  );
}
