fields: [
  {
        type: 'row',
        id: Object.toGuid(),
        label: "第三行",
        showLabel: true,
        orderNum: 3,
        gutter: 0,
        style: '',
        justify: '',
        align: '',
        children: [
            {
                type: 'col',
                id: 101,
                label: "col101",
                span: 8,
                style: '',
                children: [
                    {
                        fieldId:'',
                        type: 'field',
                        ctrType: "text",
                        label: "",
                        orderNum: 10,
                        labelWidth: null,
                        showLabel: true,
                        slot: '',
                        style: '',
                        vModel: "",
                        isRequired:false,
                        fieldRemark:'',
                        id: ''
                        //其它属性为表单控件表定义的属性
                    }
                ]
            }

        ]
    }
]