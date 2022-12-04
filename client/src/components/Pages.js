import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Pagination } from "react-bootstrap";
import { Context } from "..";

const Pages = ({paginationKey})=>{
    const {devices} = useContext(Context);
    const pageCount = Math.ceil(devices.totalCount/devices.limit);
    
    var pages = [1, 2, 3, devices.page-1, devices.page, devices.page+1, pageCount-1, pageCount];
    pages = pages.filter((it, index) => index === pages.indexOf(it)&&it>0&&it<=pageCount);
    
    return (
        <Pagination className="mt-5">
            {pages.map((page, index)=>
                pages[index]==(pages[index])?
                <Pagination.Item key={page} active={devices.page==page} onClick={()=>{devices.setPage(page)}}>{page}</Pagination.Item>
                :
                <div>...</div>)}
        </Pagination>
    );
}

export default observer(Pages);