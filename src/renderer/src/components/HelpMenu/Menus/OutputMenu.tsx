import Link from "../../../link"

const OutputMenu = () => {
    return <div className = 'w-full h-95/100 flex flex-col items-center overflow-y-auto rounded-3xl'>
        <p className = "text-3xl text-center p-2 ">Output Layers</p>
        <hr className = 'w-5/6 border-black border-1 rounded-2xl'></hr>
        <li>Because you are on the <i>Desktop</i> version, output layers store the actual <i>output data</i> that you want to train on!</li>
        <li>This means that, like inputs, we expect the data to come with a dimensionality of [# of samples, ...]</li>
        <li>An individual output, though, can look like many different things!</li>
        <li>For example, classifying an image into one of 16 classes might use an output shape of [16], where each number describes the probability of the image belonging to that respective class.</li>
        <li>P.S: This output is called a <Link href = "https://www.geeksforgeeks.org/machine-learning/ml-one-hot-encoding/">one-hot vector encoding</Link>.</li>
        <hr className = 'w-5/6 border-black border-1 rounded-2xl m-5'></hr>
        <li>Note that, if the expected shape doesn't look right, it's likely because your .npy file isn't formatted correctly.</li>
    </div>
}
export default OutputMenu