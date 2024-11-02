import { Card, Link, Text } from "@vkontakte/vkui";
import { FC, ReactNode } from "react";
import './ResourcesCard.css'
import { Icon16Chevron } from "@vkontakte/icons";

interface IResourcesCardProps {
    name: string;
    value: string | number;
    afterValue?: ReactNode;
    actionName?: string;
    action?: () => void; 
}

export const ResourcesCard = ({
    name,
    value,
    afterValue,
    actionName,
    action
}: IResourcesCardProps) => {

    return(
        <Card className="resources_card">
            <div className="resources_card__container">
                <div className='resources_card__valuebox'>
                    <div className="resources_card__valuebox__value">
                        <Text weight="2" className="resources_card__valuebox__value__text">{value}</Text>
                        {afterValue && afterValue}
                    </div>
                    <div className="resources_card__valuebox__name">
                        <Text weight="2" className="resources_card__valuebox__name__text">{name}</Text>
                    </div>
                </div>
                
                <div className='resources_card__actionbox'>
                    {action ?
                        <Link onClick={action}>
                            {actionName && actionName}
                            {actionName && <Icon16Chevron  />}
                        </Link>
                    :
                        <Text className='resources_card__actionbox--secondary'>
                            {actionName && actionName}
                        </Text>
                    }
                </div>
            </div>
        </Card>
    )
}