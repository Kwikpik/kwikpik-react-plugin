import React, { forwardRef, useCallback, useRef, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FiUploadCloud, FiX } from "react-icons/fi";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onInputFieldChanged?: React.ChangeEventHandler<HTMLInputElement>;
  width?: number | string;
  height?: number | string;
  icon?: React.ReactNode;
  onIconButtonPress?: React.MouseEventHandler<HTMLButtonElement>;
}

interface AddressFieldProps extends Omit<InputFieldProps, "onInputFieldChanged" | "icon"> {
  onAddressStringChanged: (address: string) => void;
  onCoordinatesGotten: (lat: number, lon: number) => void;
  mapsApiKey: string;
}

interface FilePickingFieldProps extends Omit<InputFieldProps, "onInputFieldChanged" | "icon"> {
  onFileSelected: (file: File | null) => void;
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onContentChanged?: (content: string) => void;
  width?: number | string;
  height?: number | string;
  icon?: React.ReactNode;
  onIconButtonPress?: React.MouseEventHandler<HTMLButtonElement>;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ onInputFieldChanged, width, height, icon, onIconButtonPress, ...props }, ref) => (
    <div
      className="flex justify-start items-center gap-2 rounded-[0.5rem] border border-[#abb0ba] px-1 py-1"
      style={{ width, height }}
    >
      {icon && (
        <button
          onClick={onIconButtonPress}
          role="button"
          className={`btn btn-ghost btn-square rounded-[inherit] btn-sm ${
            onIconButtonPress ? "btn-neutral" : "no-animation"
          } text-[1em] text-[#5c6370] flex justify-center items-center px-1 py-1 h-full`}
        >
          {icon}
        </button>
      )}
      <input
        {...props}
        ref={ref}
        onChange={onInputFieldChanged}
        className="bg-transparent px-1 py-1 w-full outline-0 border-0 text-[0.96em]"
      />
    </div>
  )
);

export const AddressInputField: React.FC<AddressFieldProps> = ({
  onAddressStringChanged,
  onCoordinatesGotten,
  mapsApiKey,
  ...props
}) => {
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const inputFieldRef = useRef<HTMLInputElement>(null);

  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: mapsApiKey, libraries: ["places"] });

  const useCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        onCoordinatesGotten(pos.coords.latitude, pos.coords.longitude);
        new google.maps.Geocoder()
          .geocode({ location: { lat: pos.coords.latitude, lng: pos.coords.latitude } })
          .then(({ results: [result] }) => {
            onAddressStringChanged(result.formatted_address);

            if (inputFieldRef.current) inputFieldRef.current.value = result.formatted_address;
          })
          .catch(console.debug);
      });
    }
  }, []);

  return (
    <>
      {isLoaded ? (
        <Autocomplete
          className="w-full"
          onLoad={(autocomplete) => setAutocomplete(autocomplete)}
          onPlaceChanged={() => {
            if (autocomplete) {
              const place = autocomplete.getPlace();

              if (place.geometry && place.geometry.location)
                onCoordinatesGotten(place.geometry.location.lat(), place.geometry.location.lng());

              if (place.formatted_address) {
                onAddressStringChanged(place.formatted_address);

                if (inputFieldRef.current) inputFieldRef.current.value = place.formatted_address;
              }
            }
          }}
        >
          <InputField
            ref={inputFieldRef}
            icon={<FaMapMarkerAlt />}
            {...props}
            type="text"
            onIconButtonPress={() => useCurrentLocation()}
          />
        </Autocomplete>
      ) : (
        <></>
      )}
    </>
  );
};

export const NumberField: React.FC<InputFieldProps> = ({ ...props }) => <InputField {...props} type="number" />;

export const TextField: React.FC<InputFieldProps> = ({ ...props }) => <InputField {...props} type="text" />;

export const FilePickingField: React.FC<FilePickingFieldProps> = ({ onFileSelected, ...props }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | undefined>(undefined);

  const handleFileSelection = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = ev.target.files;
      const file0 = files ? files[0] : undefined;

      if (file0 && file0.type.match(/image\/(jpeg|jpg|webp|png)/)) {
        setFile(file0);
        onFileSelected(file0);
      } else {
        setFile(undefined);
        onFileSelected(null);
      }
    } catch (error) {
      console.debug(error);
    }
  }, []);

  return (
    <>
      <div className="flex w-full justify-start items-center gap-2">
        <InputField
          {...props}
          width={!file ? "100%" : "98%"}
          value={file ? `${file.name}` : ""}
          disabled
          icon={<FiUploadCloud />}
          onIconButtonPress={() => {
            if (fileInputRef.current) fileInputRef.current.click();
          }}
        />
        {file && (
          <button
            onClick={() => {
              setFile(undefined);
              onFileSelected(null);

              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            className="btn btn-circle btn-neutral btn-xs flex justify-center items-center text-[0.89em] text-[#0f0e0b]"
          >
            <FiX />
          </button>
        )}
      </div>
      <input type="file" className="hidden" ref={fileInputRef} accept="image/*" onChange={handleFileSelection} />
    </>
  );
};

export const TextArea: React.FC<TextAreaProps> = ({
  width,
  height,
  icon,
  onContentChanged,
  onIconButtonPress,
  ...props
}) => (
  <div
    className="flex justify-start items-start gap-1 rounded-[0.5rem] border border-[#abb0ba] px-1 py-1"
    style={{ width, height }}
  >
    {icon && (
      <button
        onClick={onIconButtonPress}
        role="button"
        className={`btn btn-ghost btn-square rounded-[inherit] btn-sm ${
          onIconButtonPress ? "btn-neutral" : "no-animation"
        } text-[1em] text-[#5c6370] flex justify-center items-center px-1 py-1`}
      >
        {icon}
      </button>
    )}
    <textarea
      {...props}
      className="w-full h-full px-1 py-1 border-none outline-0"
      onChange={(ev) => onContentChanged && onContentChanged(ev.target.value)}
    ></textarea>
  </div>
);
