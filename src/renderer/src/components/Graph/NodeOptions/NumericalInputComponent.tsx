const InputComponent = (props : any) => {
    //reusable component that creates a numerical input box that only enables valid inputs based on certain things(negative, decimal, etc.)
    const allowNegative = props?.allowNegative ? props.allowNegative : false;
    const allowDecimal = props?.allowDecimal ? props.allowDecimal : false
    const topPadding = (props.topPadding !== undefined) ? props.topPadding : true
    const textSize = (props.textSize !== undefined) ? props.textSize : 'text-[10px]'
    const fieldSize = (props.fieldSize !== undefined) ? props.fieldSize : 'w-[40px]'
    const textColor = (props.textColor !== undefined) ? props.textColor : 'text-black'
    const borderColor = (props.borderColor !== undefined) ? props.borderColor : 'border-black'

    return (
    <div className = {`${textColor} flex flex-row w-full items-center justify-center p-1 ${topPadding ? 'pt-2' : 'pt-1'} ${textSize}`}>
        <label htmlFor={props.id} className = "pr-[3px] text-center">{props.label} </label>
        <input id = {props.id} type = "number" className = {`field-sizing-fixed ${fieldSize} border-1 rounded-sm ${borderColor} nopan nodrag text-center`}
        onChange = {(evt) => {
            let input = evt.target.value
            let neg = false
            if(allowNegative){
                if(input.length >= 1 && input.charAt(0) === '-'){
                    neg = true;
                    input = evt.target.value.slice(1)
                }
            }
            if(allowDecimal){
                let split_input = input.split('.')
                if(split_input.length >= 2){//1 = no decimal, 2 = a decimal, 3+ = bad
                    input = split_input[0].replace(/[^0-9]/g, '') + '.' + split_input[1].replace(/[^0-9]/g, '')
                }
                else{
                    input = input.replace(/[^0-9]/g, '');
                }
            }
            else{
                input = input.replace(/[^0-9]/g, '');
            }
            if(props.filter){
                input = (props.filter(input) !== undefined) ? props.filter(input) : ''
            }
            props.setFunction(input === '' ? NaN : (neg ? -Number(input) : Number(input)))
            
        }}
        value = {!isNaN(props.value) ? props.value : ''}></input>
    </div>)
}
export default InputComponent