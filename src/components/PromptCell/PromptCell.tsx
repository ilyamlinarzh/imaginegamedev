import { ReactNode, useState } from "react";
import './PromptCell.css'
import { Button, Title } from "@vkontakte/vkui";
import { Icon24Dice5Outline } from "@vkontakte/icons";

interface IPromptCellProps {
    onClick?: () => void;
    children?: string | null;
    renewing?: boolean
}

export const PromptCell = ({
    onClick,
    children,
    renewing = false
}: IPromptCellProps): ReactNode => {

    const [refreshing, setRefreshing] = useState(false)
    
    return(
        <div
        className='prompt_cell'
        >
            <div className="prompt_cell__value">
                <Title className={`prompt_cell__value__text${(children?.length == 0 || children == null) ? '--disabled' : ''}`} level='3' weight='3'>
                    {(children == null) ? 'Генерация временно недоступна' : children}
                </Title>
            </div>
            <div className="prompt_cell__action">
                <Button 
                className="prompt_cell__action__button" 
                mode='tertiary' 
                disabled={children == null}
                before={<Icon24Dice5Outline className={renewing ? 'refreshing' : ''} />} 
                onClick={onClick}
                />
            </div>
        </div>
    )
}