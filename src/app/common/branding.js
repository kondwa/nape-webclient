/*
 * Copyright (c) 2018 Mainlevel Consulting AG
 */

/* eslint-disable no-console */
import {PureComponent} from "react";
import React from "react";

export default class Branding extends PureComponent {
    static propTypes = {};

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {console.log("%c Mainlevel Consulting AG", "border-radius:4px;color:#fff;line-height:40px;padding:10px 32px;background:#a0c52a;font-weight:900;font-size:14pt")}
            </div>
        );
    }
}
