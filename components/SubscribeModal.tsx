"use client";

import React, { useState } from "react";
import Modal from "./Modal";
import { Price, ProductWithPrice } from "@/types";
import Button from "./Button";
import { useUser } from "@/hooks/useUser";
import toast from "react-hot-toast";
import { postData } from "@/libs/helpers";
import { getStripe } from "@/libs/stripeClient";
import useSubscribeModal from "@/hooks/useSubscribeModal";

interface SubscribeProviderProps {
  products: ProductWithPrice[];
}

const formatPrice = (price: Price) => {
  const priceString = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
    minimumFractionDigits: 0,
  }).format((price?.unit_amount || 0) / 100);

  return priceString;
};
const SubscribeModal: React.FC<SubscribeProviderProps> = ({ products }) => {
    const subscribeModal = useSubscribeModal();
  const { user, isLoading, subscription } = useUser();
  const [priceIdLoading, setPriceIdLoading] = useState<string>();

  const onChange = (open:boolean)=>{
    if(!open)
        subscribeModal.onClose();
  }
  const handleCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);
    if (!user) {
      setPriceIdLoading(undefined);
      return toast.error("Must be logged in");
    }

    if(subscription){
        setPriceIdLoading(undefined);
        return toast('Already Subscribed')
    }

    try{
        const {sessionId} = await postData({
            url: '/api/create-checkout-session',
            data:{price}
        });
        
        const stripe =await getStripe();

        stripe?.redirectToCheckout({sessionId});
    } catch(error){
        toast.error((error as Error).message);
    }
    finally{
        setPriceIdLoading(undefined);
    }
  };

  let content = <div className="text-center">No Products Available</div>;

  if (products.length) {
    content = (
      <div>
        {products.map((product) => {
          if (!product.prices?.length) {
            return <div key={product.id}>No Prices Available</div>;
          }

          return product.prices.map((price) => (
            <Button
              key={price.id}
              onClick={() => {
                handleCheckout(price);
              }}
              disabled={isLoading || price.id === priceIdLoading}
              className="mb-4"
            >
              {`Subscribe for ${formatPrice(price)}/${price.interval}`}
            </Button>
          ));
        })}
      </div>
    );
  }

  if(subscription){
    content=(
        <div className="text-center">
            Already Subscribed
        </div>
    )
  }

  return (
    <Modal
      title="Only for Premium Uers"
      description="Listen to music with Spotify Premium"
      isOpen={subscribeModal.isOpen}
      onChange={onChange}
    >
      {content}
    </Modal>
  );
};

export default SubscribeModal;
