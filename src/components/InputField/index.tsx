import React, { forwardRef, useCallback, useRef, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
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

export const TextInputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ onInputFieldChanged, width, height, icon, onIconButtonPress }, ref) => (
    <div
      className="flex justify-start items-center gap-2 rounded-[0.5rem] border border-[#abb0ba] px-1 py-1"
      style={{ width, height }}
    >
      {icon && (
        <button
          onClick={onIconButtonPress}
          role="button"
          className={`btn btn-ghost btn-square btn-sm ${
            onIconButtonPress ? "btn-neutral" : "btn-disabled"
          } text-[1em] text-[#5c6370] flex justify-center items-center px-1 py-1 h-full`}
        >
          {icon}
        </button>
      )}
      <input
        ref={ref}
        type="text"
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
    if (autocomplete) {
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
    }
  }, [autocomplete]);

  return (
    <>
      {isLoaded ? (
        <Autocomplete
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
          <TextInputField
            onIconButtonPress={useCurrentLocation}
            ref={inputFieldRef}
            icon={<FaMapMarkerAlt />}
            {...props}
            placeholder="Enter pickup address"
          />
        </Autocomplete>
      ) : (
        <></>
      )}
    </>
  );
};
