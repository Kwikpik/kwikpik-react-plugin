import React, { MouseEventHandler, useCallback, useState } from "react";
import ViewBaseCard from "./Base";
import {
  AddressInputField,
  FilePickingField,
  NumberField,
  Select,
  TextArea,
  TextField,
} from "../components/InputField";
import { FaCar, FaGift, FaGifts, FaSortNumericUpAlt, FaWeightHanging } from "react-icons/fa";
import { GiPriceTag } from "react-icons/gi";
import { HiOutlineDocument } from "react-icons/hi";
import { FiCheckCircle, FiCopy, FiPhone, FiUser, FiXCircle } from "react-icons/fi";
import { initializeAPI } from "@kwikpik/kwikpik.js";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Button from "../components/Button";

export interface DispatchViewProps {
  apiKey: string;
  mapsApiKey?: string;
  onClose?: MouseEventHandler<HTMLButtonElement>;
  environment?: "dev" | "prod";
}

interface DispatchRequest {
  latitude: number;
  longitude: number;
  category: string;
  product: string;
  description?: string;
  weight?: string | number;
  quantity?: number;
  image?: string | ArrayBuffer | null;
  destinationLatitude: number;
  destinationLongitude: number;
  vehicleType: "car" | "bus" | "bicycle" | "truck" | "van" | "motorcycle";
  recipientName: string;
  recipientPhoneNumber: string;
  packageValue?: number | string;
  phoneNumber: string;
  senderName: string;
}

const vehicleTypesDataProps = [
  {
    value: "motorcycle",
    key: "motorcycle",
  },
  {
    value: "bicycle",
    key: "bicycle",
  },
  {
    value: "car",
    key: "car",
  },
  {
    value: "bus",
    key: "bus",
  },
  {
    value: "truck",
    key: "truck",
  },
  {
    value: "van",
    key: "van",
  },
];

const categoryDataProps = [
  {
    value: "FOOD / DRINKS",
    key: "food / drinks",
  },
  {
    value: "JEWELRIES / ACCESSORIES",
    key: "jewelries / accessories",
  },
  {
    value: "CLOTHING / SHOES",
    key: "clothing / shoes",
  },
  {
    value: "ELECTRONICS",
    key: "electronics",
  },
  {
    value: "DOCUMENTS",
    key: "documents",
  },
  {
    value: "COMPUTER ACCESSORIES",
    key: "computer accessories",
  },
  {
    value: "HEALTH PRODUCTS",
    key: "health products",
  },
  {
    value: "OTHERS",
    key: "others",
  },
];

export default function DispatchView({ mapsApiKey, apiKey, onClose, environment = "prod" }: DispatchViewProps) {
  const [step, setStep] = useState(0);
  const api = initializeAPI(apiKey, environment);

  const [data, setData] = useState<DispatchRequest>({
    vehicleType: "motorcycle",
    category: categoryDataProps[0].value,
  } as DispatchRequest);
  const [addresses, setAddresses] = useState({
    pickup: "",
    destination: "",
  });
  const [newRequestId, setNewRequestId] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [initializationLoading, setInitializationLoading] = useState(false);
  const [confirmationLoading, setConfirmationLoading] = useState(false);

  const clearData = () => {
    setData({
      vehicleType: "motorcycle",
      category: categoryDataProps[0].value,
    } as DispatchRequest);

    setAddresses({ pickup: "", destination: "" });
  };

  const initializeRequest = useCallback(async () => {
    try {
      setInitializationLoading(true);
      const response = await api.requests.createDispatchRequest(data as any).send();

      setNewRequestId(response.id);
      setInitializationLoading(false);
      setStep(2);
    } catch (error: any) {
      setInitializationLoading(false);
      setErrorMessage(error.response?.data?.error || error.message);
      setShowError(true);
    }
  }, [api, data]);

  const confirmRequest = useCallback(async () => {
    try {
      setConfirmationLoading(true);
      await api.requests.confirmDispatchRequest(newRequestId).send();

      setConfirmationLoading(false);
      setStep(3);
      clearData();
    } catch (error: any) {
      setConfirmationLoading(false);
      setErrorMessage(error.response?.data?.error || error.message);
      setShowError(true);
    }
  }, [api, newRequestId]);

  return (
    <ViewBaseCard onClose={onClose}>
      <div className="flex justify-center items-center w-full gap-6 flex-col">
        {step < 3 && (
          <span className="text-[#000] text-sm md:text-lg capitalize font-[600]">create dispatch request</span>
        )}
        <div className="flex flex-col justify-start items-start gap-8 w-full overflow-auto">
          {step === 0 && (
            <>
              <div className="flex flex-col justify-start items-start gap-3 w-full">
                <span className="text-[#000] text-xs lg:text-sm capitalize font-[500]">locations</span>
                <div className="w-full flex justify-start items-center flex-col gap-4">
                  <AddressInputField
                    width="100%"
                    placeholder="Pickup address"
                    mapsApiKey={mapsApiKey as string}
                    onAddressStringChanged={(pickup) => setAddresses((a) => ({ ...a, pickup }))}
                    onCoordinatesGotten={(latitude, longitude) => setData((d) => ({ ...d, latitude, longitude }))}
                  />
                  <AddressInputField
                    width="100%"
                    placeholder="Drop-off address"
                    mapsApiKey={mapsApiKey as string}
                    onAddressStringChanged={(destination) => setAddresses((a) => ({ ...a, destination }))}
                    onCoordinatesGotten={(destinationLatitude, destinationLongitude) =>
                      setData((d) => ({ ...d, destinationLatitude, destinationLongitude }))
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col justify-start items-start gap-3 w-full">
                <span className="text-[#000] text-xs md:text-sm capitalize font-[500]">package</span>
                <div className="w-full flex justify-start items-center flex-col gap-4">
                  <Select
                    width="100%"
                    value={data.category}
                    dataProps={categoryDataProps}
                    onItemSelected={(category) => setData((d) => ({ ...d, category }))}
                    icon={<FaGifts />}
                  />
                  <TextField
                    width="100%"
                    value={data.product}
                    placeholder="Actual package (e.g Rice & beans)"
                    onInputFieldChanged={(ev) => setData((d) => ({ ...d, product: ev.target.value }))}
                    icon={<FaGift />}
                  />
                  <NumberField
                    width="100%"
                    value={data.weight}
                    placeholder="Package weight in kg (optional)"
                    onInputFieldChanged={(ev) => setData((d) => ({ ...d, weight: ev.target.value }))}
                    icon={<FaWeightHanging />}
                  />
                  <FilePickingField
                    width="100%"
                    placeholder="Package image (optional)"
                    onFileSelected={(file) => {
                      let fileReader: FileReader;

                      if (file) {
                        fileReader = new FileReader();
                        fileReader.onload = (ev) => {
                          const { result } = ev.target as FileReader;
                          if (result) setData((d) => ({ ...d, image: result }));
                        };
                        fileReader.readAsDataURL(file);
                      }
                    }}
                  />
                  <NumberField
                    width="100%"
                    value={data.quantity}
                    placeholder="Quantity (optional)"
                    onInputFieldChanged={(ev) => setData((d) => ({ ...d, quantity: ev.target.valueAsNumber }))}
                    icon={<FaSortNumericUpAlt />}
                  />
                  <NumberField
                    width="100%"
                    value={data.packageValue}
                    placeholder="Market price (optional)"
                    onInputFieldChanged={(ev) => setData((d) => ({ ...d, packageValue: ev.target.value }))}
                    icon={<GiPriceTag />}
                  />
                  <TextArea
                    width="100%"
                    value={data.description}
                    height={200}
                    placeholder="Package description (optional)"
                    icon={<HiOutlineDocument />}
                    onContentChanged={(description) => setData((d) => ({ ...d, description }))}
                  />
                </div>
              </div>

              <div className="flex flex-col justify-start items-start gap-3 w-full">
                <span className="text-[#000] text-xs md:text-sm capitalize font-[500]">vehicle type</span>
                <div className="w-full flex justify-start items-center flex-col gap-4">
                  <Select
                    width="100%"
                    value={data.vehicleType}
                    dataProps={vehicleTypesDataProps}
                    onItemSelected={(vehicleType) => setData((d) => ({ ...d, vehicleType }))}
                    icon={<FaCar />}
                  />
                </div>
              </div>
              <Button label="Next" width="100%" onPress={() => setStep((s) => s + 1)} />
            </>
          )}
          {step === 1 && (
            <>
              <div className="flex flex-col justify-start items-start gap-3 w-full">
                <span className="text-[#000] text-xs md:text-sm capitalize font-[500]">sender information</span>
                <div className="w-full flex justify-start items-center flex-col gap-4">
                  <TextField
                    width="100%"
                    value={data.senderName}
                    onInputFieldChanged={(ev) => setData((d) => ({ ...d, senderName: ev.target.value }))}
                    placeholder="Name"
                    icon={<FiUser />}
                  />
                  <TextField
                    width="100%"
                    value={data.phoneNumber}
                    placeholder="Phone number (required)"
                    onInputFieldChanged={(ev) => setData((d) => ({ ...d, phoneNumber: ev.target.value }))}
                    icon={<FiPhone />}
                  />
                </div>
              </div>

              <div className="flex flex-col justify-start items-start gap-3 w-full">
                <span className="text-[#000] text-xs md:text-sm capitalize font-[500]">recipient information</span>
                <div className="w-full flex justify-start items-center flex-col gap-4">
                  <TextField
                    width="100%"
                    value={data.recipientName}
                    placeholder="Name"
                    onInputFieldChanged={(ev) => setData((d) => ({ ...d, recipientName: ev.target.value }))}
                    icon={<FiUser />}
                  />
                  <TextField
                    width="100%"
                    value={data.recipientPhoneNumber}
                    placeholder="Phone number (required)"
                    onInputFieldChanged={(ev) => setData((d) => ({ ...d, recipientPhoneNumber: ev.target.value }))}
                    icon={<FiPhone />}
                  />
                </div>
              </div>
              <div className="w-full justify-center items-center flex gap-3 flex-col md:flex-row">
                <div className="w-full md:w-1/2">
                  <Button
                    label={<span className="text-sm text-[#000] capitalize">previous</span>}
                    appliedStyle="variant"
                    width="100%"
                    onPress={() => setStep((s) => s - 1)}
                    disabled={initializationLoading}
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <Button
                    label={
                      <div className="flex w-full justify-center items-center gap-3">
                        <span className="text-sm text-[#fff] capitalize">proceed</span>
                        {initializationLoading && (
                          <span className="loading loading-bars loading-sm lg:loading-md"></span>
                        )}
                      </div>
                    }
                    width="100%"
                    onPress={initializeRequest}
                    disabled={initializationLoading}
                  />
                </div>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="flex flex-col justify-start items-start gap-3 w-full">
                <span className="text-[#000] text-xs md:text-sm capitalize font-[500]">confirm request</span>
                <div className="flex flex-col justify-start items-start gap-2 w-full">
                  {Object.keys(addresses).map((key, index) => (
                    <div key={index} className="flex justify-between items-start w-full text-xs md:text-sm break-words">
                      <span className="text-[#000] capitalize">{key}</span>
                      <span className="text-[#0f0e0b]/50">{addresses[key as keyof typeof addresses]}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-start w-full text-xs md:text-sm">
                    <span className="text-[#000] capitalize">product</span>
                    <span className="text-[#0f0e0b]/50 capitalize">{data.product}</span>
                  </div>
                  <div className="flex justify-between items-start w-full text-xs md:text-sm">
                    <span className="text-[#000] capitalize">category</span>
                    <span className="text-[#0f0e0b]/50 capitalize">{data.category}</span>
                  </div>
                  <div className="flex justify-between items-start w-full text-xs md:text-sm">
                    <span className="text-[#000] capitalize">selected vehicle</span>
                    <span className="text-[#0f0e0b]/50 capitalize">{data.vehicleType}</span>
                  </div>
                  <div className="flex justify-between items-start w-full text-xs md:text-sm">
                    <span className="text-[#000] capitalize">sender</span>
                    <span className="text-[#0f0e0b]/50 capitalize">{data.senderName}</span>
                  </div>
                  <div className="flex justify-between items-start w-full text-xs md:text-sm">
                    <span className="text-[#000] capitalize">recipient</span>
                    <span className="text-[#0f0e0b]/50 capitalize">{data.recipientName}</span>
                  </div>
                  <div className="flex justify-between items-start w-full text-xs md:text-sm">
                    <span className="text-[#000] capitalize">sender phone no</span>
                    <span className="text-[#0f0e0b]/50 capitalize">{data.phoneNumber}</span>
                  </div>
                  <div className="flex justify-between items-start w-full text-xs md:text-sm">
                    <span className="text-[#000] capitalize">recipient phone no</span>
                    <span className="text-[#0f0e0b]/50 capitalize">{data.recipientPhoneNumber}</span>
                  </div>
                  <div className="flex justify-between items-start w-full text-xs md:text-sm">
                    <span className="text-[#000] capitalize">request iD</span>
                    <div className="flex justify-center items-center gap-1">
                      <span className="text-[#0f0e0b]/50 text-ellipsis">{newRequestId.slice(0, 7) + "..."}</span>
                      <CopyToClipboard text={newRequestId}>
                        <button className="btn btn-ghost btn-xs">
                          <FiCopy />
                        </button>
                      </CopyToClipboard>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full justify-center items-center flex gap-3 flex-col md:flex-row">
                <div className="w-full md:w-1/2">
                  <Button
                    disabled={confirmationLoading}
                    label={<span className="text-sm text-[#000] capitalize">clear</span>}
                    appliedStyle="variant"
                    width="100%"
                    onPress={() => {
                      setStep(0);
                      clearData();
                    }}
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <Button
                    label={
                      <div className="flex w-full justify-center items-center gap-3">
                        <span className="text-sm text-[#fff] capitalize">finish</span>
                        {confirmationLoading && <span className="loading loading-bars loading-sm lg:loading-md"></span>}
                      </div>
                    }
                    width="100%"
                    onPress={confirmRequest}
                    disabled={confirmationLoading}
                  />
                </div>
              </div>
            </>
          )}
          {step === 3 && (
            <div className="w-full flex justify-center items-center py-3 px-3">
              <div className="flex flex-col justify-start items-center gap-5">
                <div className="flex flex-col justify-start items-center gap-1">
                  <FiCheckCircle color="green" size={80} />
                  <span className="text-sm md:text-lg capitalize text-[green]/50">success</span>
                </div>
                <div className="flex justify-center items-center gap-1">
                  <span className="text-[#0f0e0b]/50 text-ellipsis text-xs md:text-sm">{newRequestId}</span>
                  <CopyToClipboard text={newRequestId}>
                    <button className="btn btn-ghost btn-xs">
                      <FiCopy />
                    </button>
                  </CopyToClipboard>
                </div>
                <Button
                  width="80%"
                  label="Done!"
                  onPress={() => {
                    setStep(0);
                    setNewRequestId("");
                  }}
                />
              </div>
            </div>
          )}
        </div>
        {showError && (
          <div className="alert alert-error">
            <FiXCircle />
            <span className="text-xs md:text-sm font-[500]">{errorMessage}</span>
            <button className="btn btn-sm btn-ghost capitalize" onClick={() => setShowError(false)}>
              close
            </button>
          </div>
        )}
      </div>
    </ViewBaseCard>
  );
}
