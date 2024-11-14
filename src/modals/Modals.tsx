import { useActiveVkuiLocation, useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import { ModalRoot } from "@vkontakte/vkui";
import { FC } from "react";
import { DeleteCard } from "./DeleteCard/DeleteCard";
import { RatingInfo } from "./RatingInfo/RatingInfo";
import { CreateRoom } from "./CreateRoom/CreateRoom";
import { CreateCard } from "./CreateCard/CreateCard";
import { PremiumInfo } from "./PremiumInfo/PremiumInfo";
import { ShareRoom } from "./ShareRoom/ShareRoom";
import { InputRoomId } from "./InputRoomId/InputRoomId";
import { ConfirmBuy } from "./ConfirmBuy/ConfirmBuy";



export const Modals: FC = () => {

    const { modal: activeModal } = useActiveVkuiLocation()

    const navigate = useRouteNavigator()

    return(
        <ModalRoot 
        activeModal={activeModal}
        onClose={()=>navigate.back()}
        >
            <DeleteCard id='deletecard' />
            <RatingInfo id='ratinginfo' />
            <CreateRoom id='createroom' />
            <CreateCard id='createcard' />
            <PremiumInfo id='premiuminfo' />
            <ShareRoom id='shareroom' />
            <InputRoomId id='inputroom' />
            <ConfirmBuy id='confirmbuy' />
        </ModalRoot>
    )
}