import { SegmentedControl } from "@mantine/core";
import { useState } from "react";
import classes from "@/app/shared/cssModules/SegmentedControl.module.css";
import PhotoFullViewDialog from "@/app/shared/components/PhotoFullViewDialog";
import Image from "next/image";
import { getPaymentLogo } from "@/app/shared/lib/getPaymentLogo";

export interface ISecurityDeposit {
  image_from_url: string | undefined;
  image_to_url: string | undefined;
  payment_method: string;
  account_name: string;
  account_number: string;
  id: string;
}

export default function SecurityDeposit({
  image_from_url,
  image_to_url,
  payment_method,
  account_name,
  account_number,
  id,
}: ISecurityDeposit) {
  const [destination, setDestination] = useState("from");

  return (
    <div className="mt-[0.5rem]">
      <div className="flex justify-between items-center">
        <span>Security Deposit</span>
        <div>
          <SegmentedControl
            classNames={{
              root: classes.root,
              control: classes.control,
              indicator: classes.indicator,
            }}
            value={destination}
            onChange={setDestination}
            color="var(--color-primary-normal)"
            data={[
              { label: "From", value: "from" },
              { label: "To", value: "to" },
            ]}
          />
        </div>
      </div>
      <div className="mt-[1rem]">
        {destination === "from" ? (
          image_from_url ? (
            <PhotoFullViewDialog url={image_from_url}>
              <div className="p-[0.5rem] flex justify-center items-center w-full h-[10rem] rounded-lg border-2 border-secondary-normal/30">
                <div className="w-full relative rounded-lg h-full">
                  <Image
                    src={image_from_url}
                    fill
                    className="object-contain object-center"
                    alt="Amihan Staycaion file upload image for booking"
                    sizes="100%"
                  />
                </div>
              </div>
            </PhotoFullViewDialog>
          ) : (
            <div className="p-[0.5rem] flex justify-center items-center w-full h-[10rem] rounded-lg border-2 border-secondary-normal/30">
              <div className="w-full relative rounded-lg h-full flex items-center justify-center opacity-50 text-center">
                <p>There is no security deposit attached to this booking</p>
              </div>
            </div>
          )
        ) : image_to_url ? (
          <div className="relative p-[0.5rem] flex flex-col justify-center items-center w-full h-[10rem] rounded-lg border-2 border-secondary-normal/30">
            <PhotoFullViewDialog url={image_to_url}>
              <div className="w-full relative rounded-lg h-[6rem]">
                <Image
                  src={image_to_url}
                  fill
                  className="object-contain object-center"
                  alt="Amihan Staycaion file upload image for booking"
                  sizes="100%"
                />
              </div>
            </PhotoFullViewDialog>
            <div className="mt-2 text-center">
              <p className="text-xs">{payment_method}</p>
              <p className="text-sm font-bold">
                {account_name} &middot; <span>{account_number}</span>
              </p>
            </div>
            <div className="absolute top-1 right-1 h-[2.5rem] w-[2.5rem]">
              <Image
                src={getPaymentLogo(payment_method)}
                fill
                alt={payment_method}
                className="object-contain object-center p-1"
              />
            </div>
          </div>
        ) : (
          <div className="p-[0.5rem] flex justify-center items-center w-full h-[10rem] rounded-lg border-2 border-secondary-normal/30">
            <div className="text-center w-full relative rounded-lg h-full flex items-center justify-center opacity-50">
              <p>No destination payment method is attached to this booking.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
