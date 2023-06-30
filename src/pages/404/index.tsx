import React, {useEffect, useState} from "react";
import ReactDom from 'react-dom';
import img404 from "./assets/404.webp";
import {Button, Image} from "antd";
import './style.scss';
import {Link} from "react-router-dom";
import RouteConst from "../../constants";


function PageNotFound (){


  return (
    <div className="page404">

      <div style={{textAlign: 'center'}}><Image width="100%" src={img404} preview={false}/></div>

      <div className="btnGroups">

        <Link to={RouteConst.HOME}>
          <Button type="primary">Back To Home</Button>
        </Link>
      </div>
    </div>
  )
}


export default PageNotFound;