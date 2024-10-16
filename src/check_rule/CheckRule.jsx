import { useCallback, useState } from 'react';
import { Select, Button, Form, Input, Row, Col } from 'antd';

const { Option } = Select;
const CheckRule = () => {
    const conditionCheckAction = ["", null, undefined]
    const listIndex = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const [conditions, setConditions] = useState([
        { no: "", operator: '>=', value: "", poi: "", connect: "", noChild: "", operatorChild: '>=', valueChild: "", poiChild: "" },
        { no: "", operator: '>=', value: "", poi: "", connect: "", noChild: "", operatorChild: '>=', valueChild: "", poiChild: "" },
        { no: "", operator: '>=', value: "", poi: "", connect: "", noChild: "", operatorChild: '>=', valueChild: "", poiChild: "" }
    ]);
    const [action, setAction] = useState({ no: "", operator: '>=', value: "", connect: "", noChild: "", operatorChild: '>=', valueChild: "" });
    const [listTextAndOr, setListTextAndOr] = useState([])

    const handleConditionChange = useCallback((index, key, val) => {
        const newConditions = [...conditions];
        try {
            newConditions[index][key] = val.target.value;
        } catch {
            newConditions[index][key] = val;
        }
        setConditions(newConditions);
    }, [conditions]);

    const handleActionChange = useCallback((key, val) => {
        const newAction = { ...action };
        try {
            newAction[key] = val.target.value;
        } catch {
            newAction[key] = val;
        }
        setAction(newAction);
    }, [action]);


    const handleSubmit = () => {
        let dataSubmit = ''

        conditions.forEach((item, index) => {
            if (item.no !== "" && item.value !== "") {
                dataSubmit += `If ${item.no} ${item.operator} ${item.value} `
                // connect operator index of
                if (item.operator === "IN") {
                    dataSubmit += `Poi ${item.poi} `
                }
                if (!conditionCheckAction.includes(item.connect) && item.noChild !== "" && item.valueChild !== "") {
                    dataSubmit += `${item.connect} ${item.noChild} ${item.operatorChild} ${item.valueChild} `

                    // connect operator index of
                    if (item.operatorChild === "IN") {
                        dataSubmit += `Poi ${item.poiChild} `
                    }
                }

                // connect AND/OR
                if (index < conditions.length - 1) {
                    if (conditions[index + 1].no !== "" && conditions[index + 1].value !== "") {
                        dataSubmit += `${index < listTextAndOr.length ? listTextAndOr[index] : ""} `
                    }
                } else if (conditions[index].no !== "" && conditions[index].value !== "") {
                    dataSubmit += `${index < listTextAndOr.length ? listTextAndOr[index] : ""} `
                }
            }
        })

        let contentThen = `${action.no} ${action.operator} ${action.value} `
        let checkDataChildOfThen = action.noChild !== "" || action.valueChild !== ""
        if (!conditionCheckAction.includes(action.connect) && checkDataChildOfThen) {
            contentThen += `${action.connect} ${action.noChild} ${action.operatorChild} ${action.valueChild} `
        }
        dataSubmit += `Then ${contentThen}`

        console.log(dataSubmit)

        const checkConnect1To2 = (conditions[0].no === "" && conditions[0].value === "") || (conditions[1].no === "" && conditions[1].value === "")
        const checkConnect2To3 = (conditions[1].no === "" && conditions[1].value === "") || (conditions[2].no === "" && conditions[2].value === "")

        let dataJson = {
            group1: conditions[0],
            connect1To2: conditionCheckAction.includes(listTextAndOr[0]) ? "" : checkConnect1To2 ? "" : listTextAndOr[0],
            group2: conditions[1],
            connect2To3: conditionCheckAction.includes(listTextAndOr[1]) ? "" : checkConnect2To3 ? "" : listTextAndOr[1],
            group3: conditions[2],
            then: action
        }
        console.log(dataJson)
    };

    const changeTextAndOr = (value, index) => {
        let newList = [...listTextAndOr]
        newList[index] = value
        setListTextAndOr(newList)
    }

    const showResultCreateRule = () => {
        let dataRule = ''

        conditions.forEach((item, index) => {
            if (item.no !== "" && item.value !== "") {
                dataRule += `If ${item.no} ${item.operator} ${item.value} `
                if (item.operator === "IN") {
                    dataRule += `Poi ${item.poi} `
                }
                if (!conditionCheckAction.includes(item.connect) && item.noChild !== "" && item.valueChild !== "") {
                    dataRule += `${item.connect} ${item.noChild} ${item.operatorChild} ${item.valueChild} `
                    if (item.operatorChild === "IN") {
                        dataRule += `Poi ${item.poiChild} `
                    }
                }
                if (index < conditions.length - 1) {
                    if (conditions[index + 1].no !== "" && conditions[index + 1].value !== "") {
                        dataRule += `${index < listTextAndOr.length ? listTextAndOr[index] : ""} `
                    }
                } else if (conditions[index].no !== "" && conditions[index].value !== "") {
                    dataRule += `${index < listTextAndOr.length ? listTextAndOr[index] : ""} `
                }
            }
        })

        let contentThen = `Then ${action.no} ${action.operator} ${action.value} `
        let checkDataChildOfThen = action.noChild !== "" || action.valueChild !== ""
        if (!conditionCheckAction.includes(action.connect) && checkDataChildOfThen) {
            contentThen += `${action.connect} ${action.noChild} ${action.operatorChild} ${action.valueChild} `
        }

        console.log(contentThen)
        return (
            <>
                <p>{dataRule}</p>&nbsp;
                <p>{contentThen}</p>
            </>
        )
    }

    return (
        <div className='container-create-rule'>
            <div className='body-create-rule'>
                <h2>Tạo quy tắc</h2>
                <Form className='form-rule' layout="vertical" >
                    <Row style={{ display: "flex", width: "100%" }}>
                        <Col span={3}>
                            {<p style={{ margin: 0 }}>Nếu: </p>}
                        </Col>
                        <Col span={21} style={{ display: "grid", rowGap: "2ch" }}>
                            {conditions.map((condition, index) => (
                                <>
                                    <div style={{ columnGap: "1ch", display: "flex" }}>
                                        <Row style={{ display: "contents" }}>
                                            <Form.Item>
                                                <Input
                                                    value={condition.no}
                                                    onChange={(val) => handleConditionChange(index, 'no', val)}
                                                    placeholder='VD: N20'
                                                />
                                            </Form.Item>
                                            <Form.Item>
                                                <Select
                                                    value={condition.operator}
                                                    onChange={(val) => handleConditionChange(index, 'operator', val)}
                                                >
                                                    <Option value=">=">&ge;</Option>
                                                    <Option value="<=">&le;</Option>
                                                    <Option value=">">&gt;</Option>
                                                    <Option value="<">&lt;</Option>
                                                    <Option value="=">=</Option>
                                                    <Option value="<>">{"<>"}</Option>
                                                    <Option value="IN">IN</Option>
                                                </Select>
                                            </Form.Item>
                                            <Form.Item>
                                                <div style={{ display: "grid", rowGap: "0.5ch", alignContent: "space-between" }}>
                                                    <Input
                                                        value={condition.value}
                                                        placeholder='VD: N20'
                                                        onChange={(val) => handleConditionChange(index, 'value', val)}
                                                        style={{ width: 100 }}
                                                    />
                                                    {condition.operator === "IN" &&
                                                        <label style={{ marginLeft: "auto" }}>
                                                            <span style={{ marginRight: '6px' }}>Poi:</span>
                                                            <Select
                                                                onChange={(val) => handleConditionChange(index, 'poi', val)}
                                                                style={{ textAlign: "end", width: "fit-content" }}
                                                            >
                                                                {listIndex.map(item => (
                                                                    <Option key={item} value={item}>{item}</Option>
                                                                ))}
                                                            </Select>
                                                        </label>
                                                    }
                                                </div>
                                            </Form.Item>
                                        </Row>

                                        <Select
                                            value={condition.connect}
                                            onChange={(val) => handleConditionChange(index, 'connect', val)}
                                            style={{ width: 80 }}

                                        >
                                            <Option value="AND">AND</Option>
                                            <Option value="OR">OR</Option>
                                        </Select>

                                        <Row style={{ display: "contents" }}>
                                            <Form.Item>
                                                <Input
                                                    value={condition.noChild}
                                                    onChange={(val) => handleConditionChange(index, 'noChild', val)}
                                                    placeholder='VD: N20'
                                                />
                                            </Form.Item>
                                            <Form.Item>
                                                <Select
                                                    value={condition.operatorChild}
                                                    onChange={(val) => handleConditionChange(index, 'operatorChild', val)}
                                                >
                                                    <Option value=">=">&ge;</Option>
                                                    <Option value="<=">&le;</Option>
                                                    <Option value=">">&gt;</Option>
                                                    <Option value="<">&lt;</Option>
                                                    <Option value="=">=</Option>
                                                    <Option value="<>">{"<>"}</Option>
                                                    <Option value="IN">IN</Option>
                                                </Select>
                                            </Form.Item>
                                            <Form.Item>
                                                <div style={{ display: "grid", rowGap: "0.5ch", alignContent: "space-between" }}>
                                                    <Input
                                                        value={condition.valueChild}
                                                        placeholder='VD: N20'
                                                        onChange={(val) => handleConditionChange(index, 'valueChild', val)}
                                                        style={{ width: 100 }}
                                                    />
                                                    {condition.operatorChild === "IN" &&
                                                        <label style={{ marginLeft: "auto" }}>
                                                            <span style={{ marginRight: '6px' }}>Poi:</span>
                                                            <Select
                                                                onChange={(val) => handleConditionChange(index, 'poiChild', val)}
                                                                style={{ textAlign: "end", width: "fit-content" }}
                                                            >
                                                                {listIndex.map(item => (
                                                                    <Option key={item} value={item}>{item}</Option>
                                                                ))}
                                                            </Select>
                                                        </label>
                                                    }
                                                </div>
                                            </Form.Item>
                                        </Row>
                                    </div>

                                    {index < conditions.length - 1 &&
                                        <Select
                                            value={listTextAndOr[index]}
                                            onChange={(value) => changeTextAndOr(value, index)}
                                            style={{ width: 80 }}

                                        >
                                            <Option value="AND">AND</Option>
                                            <Option value="OR">OR</Option>
                                        </Select>}
                                </>
                            ))}
                        </Col>
                    </Row>
                </Form>

                <Row>
                    <Col span={3}>
                        Thì:
                    </Col>
                    <Col span={21} style={{ display: "flex", columnGap: "1ch" }}>
                        <div style={{ columnGap: "1ch", display: "flex" }}>
                            <Row style={{ display: "contents" }}>
                                <Form.Item>
                                    <Input
                                        value={action.no}
                                        onChange={(val) => handleActionChange('no', val)}
                                        placeholder='VD: N20'
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Select
                                        value={action.operator}
                                        onChange={(val) => handleActionChange('operator', val)}
                                    >
                                        <Option value=">=">&ge;</Option>
                                        <Option value="<=">&le;</Option>
                                        <Option value=">">&gt;</Option>
                                        <Option value="<">&lt;</Option>
                                        <Option value="=">=</Option>
                                        <Option value="<>">{"<>"}</Option>
                                        <Option value="IN">IN</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item>
                                    <div style={{ display: "grid", rowGap: "0.5ch", alignContent: "space-between" }}>
                                        <Input
                                            value={action.value}
                                            placeholder='VD: N20'
                                            onChange={(val) => handleActionChange('value', val)}
                                            style={{ width: 100 }}
                                        />
                                    </div>
                                </Form.Item>
                            </Row>

                            <Select
                                value={action.connect}
                                onChange={(val) => handleActionChange('connect', val)}
                                style={{ width: 80 }}
                            >
                                <Option value="AND">AND</Option>
                                <Option value="OR">OR</Option>
                            </Select>

                            <Row style={{ display: "contents" }}>
                                <Form.Item>
                                    <Input
                                        value={action.noChild}
                                        onChange={(val) => handleActionChange('noChild', val)}
                                        placeholder='VD: N20'
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Select
                                        value={action.operatorChild}
                                        onChange={(val) => handleActionChange('operatorChild', val)}
                                    >
                                        <Option value=">=">&ge;</Option>
                                        <Option value="<=">&le;</Option>
                                        <Option value=">">&gt;</Option>
                                        <Option value="<">&lt;</Option>
                                        <Option value="=">=</Option>
                                        <Option value="<>">{"<>"}</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item>
                                    <Input
                                        value={action.valueChild}
                                        placeholder='VD: N20'
                                        onChange={(val) => handleActionChange('valueChild', val)}
                                        style={{ width: 100 }}
                                    />
                                </Form.Item>
                            </Row>
                        </div>
                    </Col>
                </Row>

                <p style={{ display: "flex", alignItems: "center" }}>
                    {showResultCreateRule()}
                </p>

                <Button
                    Button type="primary"
                    // disabled={conditionCheckAction.includes(action[0]) || conditionCheckAction.includes(action[1])}
                    onClick={handleSubmit} >
                    Lưu quy tắc
                </Button>
            </div>
        </div>
    );
}

export default CheckRule