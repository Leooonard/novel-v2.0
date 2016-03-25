/*
    物理层将不集成到设备中, 物理层将集成到网线中.
    物理层可以选择物理层种类, 物理层的带宽, 传播延迟.
    在模型中, 物理层的作用是保存物理层的数据信息.
    数据信息通过视图中的物理层对象提供的接口获取.
    模型中不需分多个物理层对象, 因模型只是保存信息. 信息的数据结构不会改变.
*/

class PhysicalLayer extends BaseLayer {
    constructor() {
        //物理层数据结构.
        this.info = {
            "type": false,
            "bindWidth": false,
            "delay": false
        }
    }
}