const CompilationMenu = (props : any) => {
    return (
        <>
        <div className = 'absolute w-full h-full z-10 flex flex-col justify-center items-center'>
            <div className = ' border-black rounded-2xl w-95/100 h-95/100 bg-gray-500 opacity-70 flex flex-col'>
            </div>
        </div>
        <div className = 'absolute w-full h-full z-11 flex flex-col justify-center items-center'>
            <div className = 'w-95/100 h-95/100 overflow-y-auto'>
                <p className = 'text-[100px] text-white text-center p-[30px]'>Ready to Compile?</p>
                <p className = 'text-[20px] text-white text-center p-[10px]'>Compilation is the process by which we turn your model diagram into a real, functional Keras model. Exciting, right?</p>
                <p className = 'text-[20px] text-white text-center p-[10px]'>Because you're running the <i>Desktop</i> version of tfBlocks, after compilation, you will have the option of training this model on your input and output data.</p>
                <p className = 'text-[10px] text-white text-center p-[10px]'>Note: your compiled model is not saved unless you explicitly ask for it to be saved.</p>
                <div className = 'pt-[40px] w-full h-fit flex justify-around items-center pb-[30px]'>
                     <div className = 'w-1/2 flex justify-around items-center'>
                        <button onClick = {props.turnOff}>
                            <div className = 'min-w-fit h-[50px] border-1 rounded-2xl border-black bg-red-400 flex justify-center items-center cursor-pointer'>
                                <div className = 'p-[15px]'>
                                    <p className = 'text-[30px] text-white text-center'>Cancel</p>
                                </div>
                            </div>
                        </button>
                        <button onClick = {() => {
                                props.upload();
                                props.proceed();
                                }}>
                            <div className = 'min-w-fit h-[50px] border-1 rounded-2xl border-black bg-green-400 flex justify-center items-center cursor-pointer'>
                                <div className = 'p-[15px]'>
                                    <p className = 'text-[30px] text-white text-center'>Compile</p>
                                </div>
                            </div>
                        </button>
                        
                    </div>

                </div>
            </div>
        </div>
        </>
    )
}
export default CompilationMenu
