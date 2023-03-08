import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { ListGroup, Accordion, Row, Form, Col, Button, Dropdown, DropdownButton } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Context } from "../..";
import { DEVICES_ROUTE } from "../../utils/consts";
import { fetchProps } from "../../http/typeAPI";
import { fetchDevices } from "../../http/deviceAPI";
import { SortUp, SortDown } from 'react-bootstrap-icons';

var myMap = function (obj, callback) {
    var result = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof callback === 'function') {
                let tmp = callback(obj[key], key, obj)
                if (tmp) {
                    result.push(tmp);
                }
            }
        }
    }
    return result;
};

const TypeBar = observer(({ typeId }) => {
    const { devices, filters } = useContext(Context);
    const [__updater, __setUpdate] = useState(false);
    //LOading dynamic filters for type
    useEffect(() => {
        if (typeId == "custom" || filters.typeId == typeId) {
            return;
        }
        else {
            fetchProps(typeId).then(data => {
                filters.setFilters(typeId, data.result_key);
                filters.setProps(filters.parsePropsObj(data, true));
            });
        }
    }, []);

    const _clickFilter = (e) => {
        e.checked = !e.checked;
    }
    const _submit = async () => {
        let filterObj = filters.getAllFilters();
        const data = await fetchDevices(typeId, devices.limit, (devices.page - 1) * devices.limit, JSON.stringify(filterObj));
        devices.setDevices(data.rows);
        devices.setTotalCount(data.count);
        filters.setResultKey(data.result_key);
    }
    const resetFilters = () => {
        filters.resetFilters();
        __setUpdate(!__updater);
    };
    return (
        <>
            <ListGroup className="mt-2">
                <Button onClick={resetFilters}>Clear</Button>
                <Accordion defaultActiveKey="0" alwaysOpen>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Sort by</Accordion.Header>
                        <Accordion.Body>
                            <Row>
                                <Col> <DropdownButton
                                    title={filters.sortBy}
                                    onSelect={(e) => { filters.setSortBy(e) }}
                                >
                                    <Dropdown.Item eventKey="price">Price</Dropdown.Item>
                                    <Dropdown.Item eventKey="rating">Rating</Dropdown.Item>
                                    <Dropdown.Item eventKey="reviews">Reviews</Dropdown.Item>
                                </DropdownButton>
                                </Col>
                                <Col>{filters.sortOrder ?
                                    <SortDown style={{ fontSize: '30px' }} onClick={() => { filters.setSortOrder(false) }} /> :
                                    <SortUp style={{ fontSize: '30px' }} onClick={() => { filters.setSortOrder(true) }} />}
                                </Col>
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                <Accordion defaultActiveKey="0" alwaysOpen>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Price</Accordion.Header>
                        <Accordion.Body>
                            Price:
                            <Row>
                                <Col><Form.Control placeholder="min"
                                    value={filters.priceMin}
                                    onChange={e => filters.setPriceMin(e.target.value)} />
                                </Col>
                                <Col><Form.Control placeholder="max"
                                    value={filters.priceMax}
                                    onChange={e => filters.setPriceMax(e.target.value)} />
                                </Col>
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                {filters.props ? myMap(filters.props, (el, key) =>
                    <Accordion key={key} defaultActiveKey={key} alwaysOpen>
                        <Accordion.Item eventKey={key}>
                            <Accordion.Header>{key}</Accordion.Header>
                            <Accordion.Body>
                                {el.map(sub =>
                                    <Row key={sub.val}>
                                        <Col>
                                            <Form.Check
                                                key={key + __updater}
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
                ) : ''}
            </ListGroup>

            <Button style={{ width: "100%" }} onClick={_submit}>Search</Button>
        </>

    );
});

export default TypeBar;