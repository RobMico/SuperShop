import React from "react"
import { Container, Tabs, Tab } from "react-bootstrap"
import AdminNav from "../AdminNav";
import RedisKeysView from "./AdminCacheComponents/RedisKeysView";
import RedisFiltersView from "./AdminCacheComponents/RedisFiltersView";
import UploadData from "./AdminCacheComponents/UploadData";

let AdminCache = () => {
    return (
        <Container>
            <AdminNav />
            <Tabs
                defaultActiveKey="profile"
                id="uncontrolled-tab-example"
                className="mb-3"
            >
                <Tab eventKey="keys" title="All keys">
                    <RedisKeysView/>
                </Tab>
                <Tab eventKey="filters" title="Filters">
                    <RedisFiltersView/>
                </Tab>
                <Tab eventKey="upload" title="Upload json">
                    <UploadData/>
                </Tab>
            </Tabs>
        </Container>
    )
}

export default AdminCache;