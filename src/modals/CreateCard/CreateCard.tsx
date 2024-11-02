import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import { Button, FormItem, Group, Input, ModalCard, NavIdProps, Placeholder, Spacing } from "@vkontakte/vkui";
import { FC, useState } from "react";
import { IconEmptyMagicCard } from "../../components/icons/IconMagicCard/IconMagicCard";
import { useAtomValue } from "jotai";
import { promptAtom } from "../../storage";


export const CreateCard: FC<NavIdProps> = ({id}) => {

    const navigator = useRouteNavigator()

    const prompt = useAtomValue(promptAtom)

    const [promptValue, setPromptValue] = useState<string>('')

    const close = () => {
        navigator.back()
    }

    const goGenerate = () => {
        navigator.replace('/cards/generate', {state:{mode:'generate', prompt:promptValue}})
    }

    const tooLongPrompt = promptValue.length > 50;

    return(
        <ModalCard
        id={id}
        onClose={close}
        header='Введите запрос'
        subheader='В деталях опишите желаемый вид карты'
        >
            <Group>
                <Spacing size={12} />
                <FormItem
                noPadding
                bottom={tooLongPrompt && 'Слишком длинный запрос'}
                status={tooLongPrompt ? 'error' : 'default'}
                >
                    <Input 
                    placeholder={prompt} 
                    value={promptValue}
                    onChange={(e)=>setPromptValue(e.currentTarget.value)}
                    />
                </FormItem>
                <Spacing size={12} />
                <Button
                stretched
                size='l'
                align='center'
                disabled={tooLongPrompt || promptValue.length == 0}
                onClick={goGenerate}
                >
                    <span className='button_text--iconable'>
                        <span>Сгенерировать за 5 </span>
                        <IconEmptyMagicCard />
                    </span>
                </Button>
            </Group>
        </ModalCard>
    )
}