const InputMenu = () => {
    return <div className = 'w-full h-95/100 flex flex-col items-center overflow-y-auto rounded-3xl'>
        <p className = "text-3xl text-center p-2 ">Input Layers</p>
        <hr className = 'w-5/6 border-black border-1 rounded-2xl m-5'></hr>
        <li>Because you are on the <i>Desktop</i> version, input layers store the <i>input data</i> that you want to train on!</li>
        <li>Inputs can be of all kinds! For example, an 16x16 RGB image input might be [16,16,3].</li>
        <hr className = 'w-5/6 border-black border-1 rounded-2xl m-5'></hr>
        <li>Before you put anything in, though, note that we have a few rules that you shouldn't overlook!
            <ol className = 'decimal list-inside'>
                <li>Convolutional & pooling layers expect that the channels(think RGB) are in the last position.</li>
                <li>Recurrent layers expect that the timesteps are in the first position.</li>
                <li>This data should include <i>all</i> your samples with the dimensionality [# of samples, ...]</li>
            </ol>
        </li>
        <hr className = 'w-5/6 border-black border-1 rounded-2xl m-5'></hr>
        <li>Note that, if the output shape doesn't look right, it's likely because your .npy file isn't formatted correctly.</li>
    </div>
}
export default InputMenu