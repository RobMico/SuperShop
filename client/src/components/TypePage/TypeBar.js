import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { ListGroup, Accordion, Row, Form, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Context } from "../..";
import { DEVICES_ROUTE } from "../../utils/consts";
import { fetchProps } from "../../http/typeAPI";
import { fetchDevices } from "../../http/deviceAPI";

var myMap = function (obj, callback) {
    var result = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof callback === 'function') {
                let tmp = callback(obj[key], key, obj)
                if(tmp)
                {
                    result.push(tmp);
                }
            }
        }
    }
    return result;
};

const TypeBar = observer(({ typeId }) => {
    const { types, devices } = useContext(Context);

    //LOading dynamic filters for type
    useEffect(() => {
        if (devices.savedFilters.typeId == typeId) {
            return;
        }
        else {
            fetchProps(typeId).then(data => {                
                types.setProps(types.parsePropsObj(data, true));
                devices.setSavedFilters({ dynamic: [], typeId: typeId, result_key:data.result_key })
            })
        }
    }, [])

    const _clickFilter = (e) => {        
        e.checked = !e.checked;        
    }
    const _submit = async () => {
        let dynamic = myMap(types.props, (val, key)=>{
            return val.reduce((prev, cur)=>{                
                if(cur.checked)
                {
                    if(!prev)
                    {
                        prev = key+"_"+cur.val;
                    }
                    else if(Array.isArray(prev))
                    {
                        prev.push(key+"_"+cur.val)
                    }
                    else
                    {
                        prev = [prev, key+"_"+cur.val]
                    }
                }
                return prev;
            }, null)
            // if(res)
            // {
            //     return res;
            // }
        })
        devices.setSavedFilters({dynamic:dynamic, result_key:null});        
        const data = await fetchDevices(typeId, devices.limit, (devices.page - 1) * devices.limit, JSON.stringify(devices.savedFilters));        
        devices.setDevices(data.rows);
        devices.setTotalCount(data.count);
        devices.setSavedFilters({result_key:data.result_key});
    }


    return (
        <>
            <ListGroup className="mt-2">
                <Button onClick={e=>{devices.resetStore();_submit()}}>Clear</Button>
                <Accordion defaultActiveKey="0" alwaysOpen>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Price</Accordion.Header>
                        <Accordion.Body>
                            Price:
                            <Row>
                                <Col><Form.Control placeholder="min"
                                    value={devices.savedFilters.minPrice}
                                    onChange={e => devices.setSavedFilters({ minPrice: e.target.value })} />
                                </Col>
                                <Col><Form.Control placeholder="max"
                                    value={devices.savedFilters.maxPrice}
                                    onChange={e => devices.setSavedFilters({ maxPrice: e.target.value })} />
                                </Col>
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                {types.props ? myMap(types.props, (el, key) =>
                    <Accordion key={key} defaultActiveKey={key} alwaysOpen>
                        <Accordion.Item eventKey={key}>
                            <Accordion.Header>{key}</Accordion.Header>
                            <Accordion.Body>
                                {el.map(sub =>
                                    <Row key={sub.val}>
                                        <Col>
                                            <Form.Check
                                                defaultChecked={sub.checked}//{devices.savedFilters.dynamic.includes(key + '_' + sub.val)}
                                                inline
                                                label={sub.val}
                                                onChange={e => _clickFilter(sub)}//_clickFilter(key + "_" + sub.val)}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Label style={{ textAlign: 'right' }}>{sub.count}</Form.Label>
                                        </Col>
                                    </Row>

                                )}
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                ) : 'Loading'}
            </ListGroup>

            <Button style={{ width: "100%" }} onClick={_submit}>Search</Button>
        </>

    );
});

export default TypeBar;