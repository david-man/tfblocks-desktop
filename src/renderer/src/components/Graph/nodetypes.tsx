import InputLayerNode from './Nodes/InputLayerNode';
import DotProductNode from './Nodes/SpecificNodes/DotProductNode';
import TransposeNode from './Nodes/SpecificNodes/TransposeNode';
import DenseNode from './Nodes/SpecificNodes/DenseNode';
import ConvNode from './Nodes/SpecificNodes/ConvNode';
import AddNode from './Nodes/SpecificNodes/AddNode';
import ActivationNode from './Nodes/SpecificNodes/ActivationNode';
import PoolingNode from './Nodes/SpecificNodes/PoolingNode';
import NormalizationNode from './Nodes/SpecificNodes/NormalizationNode';
import DropoutNode from './Nodes/SpecificNodes/DropoutNode';
import CutNode from './Nodes/SpecificNodes/CutNode';
import RecurrentNode from './Nodes/RecurrentNode';
import GRUNode from './Nodes/SpecificNodes/GRUNode';
import LSTMNode from './Nodes/SpecificNodes/LSTMNode';
import RNNNode from './Nodes/SpecificNodes/RNNNode';
import ConcatenateNode from './Nodes/SpecificNodes/ConcatenateNode';
import UpscaleNode from './Nodes/SpecificNodes/UpscaleNode';
import FlattenNode from './Nodes/SpecificNodes/FlattenNode';
import OutputLayerNode from './Nodes/OutputLayerNode';
import SubtractNode from './Nodes/SpecificNodes/SubtractNode';
import MultiplyNode from './Nodes/SpecificNodes/MultiplyNode';
import ScalarOpsNode from './Nodes/SpecificNodes/ScalarOpsNode';
import ReshapeNode from './Nodes/SpecificNodes/ReshapeNode';
import CustomMatrixNode from './Nodes/SpecificNodes/CustomMatrixNode';
import DivideNode from './Nodes/SpecificNodes/DivideNode';

export const nodeTypes = {
    input_layer : InputLayerNode,
    dot_product : DotProductNode,
    transpose : TransposeNode,
    dense : DenseNode, 
    conv : ConvNode,
    add : AddNode,
    subtract : SubtractNode,
    multiply : MultiplyNode,
    activation : ActivationNode,
    pooling : PoolingNode,
    norm : NormalizationNode,
    dropout : DropoutNode,
    cut : CutNode,
    recurrent_head : RecurrentNode,
    gru : GRUNode,
    lstm : LSTMNode,
    rnn : RNNNode,
    concatenate : ConcatenateNode,
    upscale : UpscaleNode,
    flatten : FlattenNode,
    output_layer : OutputLayerNode,
    scalar_ops : ScalarOpsNode,
    reshape : ReshapeNode,
    custom_matrix : CustomMatrixNode,
    divide : DivideNode
}
