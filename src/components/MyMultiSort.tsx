import React, {useEffect, useState} from "react";
import {
    Badge,
    Button,
    createStyles,
    Divider,
    FormControl,
    makeStyles,
    MenuItem,
    Select,
    Theme,
    Typography,
    withStyles
} from "@material-ui/core";
import {ArrowDownwardOutlined, ArrowUpwardOutlined} from "@material-ui/icons";
import RemoveIcon from '@material-ui/icons/Remove';
import MoreVertIcon from '@material-ui/icons/MoreVert';

export interface Sort {
    column: string;
    sortDirection: 'asc' | 'desc';
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& > *': {
                margin: theme.spacing(1),
            },
        }
    }),
);

const StyledBadge = withStyles((theme: Theme) => ({
    badge: {
        // top: '50%',
        // right: -3,
        fontSize: "0.85rem",
        border: "none",
        color: "grey"
        // The border color match the background color.
        // border: `2px solid ${
        //     theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[900]
        // }`,
        // fontWeight: "bold",
    },
}))(Badge);

// const MyMultiSort = ({resetQuery, getQuery}) => {
const MyMultiSort = () => {

        const classes = useStyles();

        const sortEnums = ["desc", "asc", "undefined"];

        const max = 3;

        const [MAXorder, setMAXorder] = useState(0);

        const [removedOrder, setRemovedOrder] = useState({
            id: undefined as unknown as number,
        });

        const [params, setParams] = useState([
            {
                id: 1,
                columnName: "COUNT_CASH",
                translation: "Count Credit",
                sortEnum: sortEnums[2],
                clickCount: 2,
                order: 0
            },
            {
                id: 2,
                columnName: "COUNT_CREDIT",
                translation: "Count Cash",
                sortEnum: sortEnums[2],
                clickCount: 2,
                order: 0
            },
            {
                id: 3,
                columnName: "COUNT_TOTAL",
                translation: "Count Total",
                sortEnum: sortEnums[2],
                clickCount: 2,
                order: 0
            }
        ]);

        const handleMouseClick = (id: number, type?: string) => {
            // mouse event
            const newState = params.map(param => {
                if (type) {
                    if (type === "desc") {
                        if (param.id === id) {
                            return {
                                ...param,
                                sortEnum: sortEnums[0],
                                clickCount: 0,
                                order: 1
                            }
                        } else return {
                            ...param,
                            sortEnum: sortEnums[2],
                            clickCount: 2,
                            order: 0
                        }
                    } else if (param.id === id) {
                        return {
                            ...param,
                            sortEnum: sortEnums[1],
                            clickCount: 1,
                            order: 1
                        }
                    } else return {
                        ...param,
                        sortEnum: sortEnums[2],
                        clickCount: 2,
                        order: 0
                    }
                } else {
                    if (param.id === id) {
                        let newIndex = param.clickCount
                        if (param.clickCount < sortEnums.length - 1) {
                            newIndex += 1
                        } else {
                            newIndex = 0
                        }
                        return {
                            ...param,
                            clickCount: newIndex,
                            sortEnum: sortEnums[newIndex],
                            order: newIndex !== 2 ? 1 : 0
                        }
                    } else {
                        return {
                            ...param,
                            sortEnum: sortEnums[2],
                            order: 0,
                            clickCount: 2
                        }
                    }
                }
            })
            setParams(newState)
        };

        const handleCombinedClicks = (id: any, event: any) => {
            // mouse + Ctrl key
            if (event.type === "click" && event.ctrlKey === true) {
                const maxOrder = Math.max(...params.map(param => param.order))
                setMAXorder(maxOrder)

                const orderedState = params.map(
                    (param) => {
                        if (MAXorder === 0) {
                            if (param.id === id) {
                                let newIndex = param.clickCount
                                if (param.clickCount < sortEnums.length - 1) {
                                    newIndex += 1
                                } else {
                                    newIndex = 0
                                }
                                return {
                                    ...param,
                                    sortEnum: sortEnums[newIndex],
                                    clickCount: newIndex,
                                    order: 1
                                }
                            } else return param
                        } else if (MAXorder < max) {
                            if (param.id === id) {
                                let prevOrder = param.order
                                let newIndex = param.clickCount
                                if (param.clickCount < sortEnums.length - 1) {
                                    newIndex += 1
                                } else {
                                    newIndex = 0
                                }
                                if (newIndex === 2) {
                                    setRemovedOrder({id: param.id})
                                    return {
                                        ...param,
                                        sortEnum: sortEnums[newIndex],
                                        clickCount: newIndex,
                                        order: 0
                                    }
                                } else {
                                    return {
                                        ...param,
                                        sortEnum: sortEnums[newIndex],
                                        clickCount: newIndex,
                                        order: prevOrder === 0 ? MAXorder + 1 : prevOrder
                                    }
                                }
                            } else return param
                        } else if (param.id === id) {
                            let newIndex = param.clickCount
                            if (param.clickCount < sortEnums.length - 1) {
                                newIndex += 1
                            } else {
                                newIndex = 0
                            }
                            const prevOrder = param.order
                            if (sortEnums[newIndex] === "undefined" && prevOrder !== max) {
                                setRemovedOrder({id: param.id})
                            }
                            return {
                                ...param,
                                clickCount: newIndex,
                                sortEnum: sortEnums[newIndex],
                                order: sortEnums[newIndex] === "undefined" ? 0 : prevOrder
                            }
                        } else return param
                    }
                )
                setParams(orderedState)
            } else {
                handleMouseClick(id)
            }
        };

        const menuClick = (index: number, id: number) => {
            const maxOrder = Math.max(...params.map(param => param.order))
            setMAXorder(maxOrder)
            const newState = params.map(param => {
                if (maxOrder === 0) {
                    if (param.id === id) {
                        if (index === 2) setRemovedOrder({id: param.id});
                        return {
                            ...param,
                            sortEnum: sortEnums[index],
                            clickCount: index,
                            order: index !== 2 ? 1 : 0
                        }
                    } else return param
                } else if (maxOrder < max) {
                    if (param.id === id) {
                        if (index === 2) {
                            setRemovedOrder({id: param.id})
                            return {
                                ...param,
                                sortEnum: sortEnums[index],
                                clickCount: index,
                                order: 0
                            }
                        } else {
                            let prevOrder = param.order
                            return {
                                ...param,
                                sortEnum: sortEnums[index],
                                clickCount: index,
                                order: prevOrder === 0 ? MAXorder + 1 : prevOrder
                            }
                        }
                    } else return param
                } else if (param.id === id) {
                    const prevOrder = param.order;
                    if (index === 2 && prevOrder !== max) setRemovedOrder({id: param.id});
                    return {
                        ...param,
                        sortEnum: sortEnums[index],
                        clickCount: index,
                        order: index !== 2 ? param.order : 0
                    }
                } else return param
            })
            setParams(newState)
        };

        const handleTouchClick = (index: unknown | string, id: number) => {
            switch (index) {
                case "desc":
                    handleMouseClick(id, index)
                    break;
                case "asc":
                    handleMouseClick(id, index)
                    break;
                case 0:
                    menuClick(index, id)
                    break;
                case 1:
                    menuClick(index, id)
                    break;
                case 2:
                    menuClick(index, id)
                    break;
                default:
                    return
            }
        };

        const submitSortParams = () => {
            if (params.some(param => param.order !== 0)) {
                const sortedParams = params.filter(param => param.order !== 0).sort((a, b) => {
                    return a.order - b.order;
                });
                const query = sortedParams.map(param => `&sort=${param.columnName},${param.sortEnum}`).join("");
                // getQuery(query);
            }
        };

        const resetSortParams = () => {
            const resetParams = params.map(param => ({
                    id: param.id,
                    columnName: param.columnName,
                    translation: param.translation,
                    sortEnum: sortEnums[2],
                    clickCount: 2,
                    order: 0
                })
            );
            setParams(resetParams);
            // resetQuery();
        };

        useEffect(() => {
            const maxOrder = Math.max(...params.map(param => param.order))
            setMAXorder(maxOrder)
        }, [params, removedOrder])

        useEffect(
            () => {
                if (removedOrder.id !== undefined) {
                    const myState = params.map(param => {
                        if (param.id !== removedOrder.id && param.order !== 1) {
                            let prevOrder = param.order
                            return {
                                ...param,
                                order: prevOrder - 1 <= 0 ? 0 : prevOrder - 1
                            }
                        } else return {
                            ...param
                        }
                    })
                    setParams(myState)
                }
            }
            , [removedOrder])

        return (
            <div style={{
                width: "100%",
                borderBottom: "1px solid grey"
            }}>
                <div style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap",
                    padding: "5px",
                    backgroundColor: "whitesmoke"
                }}>
                    {/*<Typography variant={"caption"} style={{paddingLeft: 10}}>*/}
                    {/*    مرتب سازی بر اساس :*/}
                    {/*</Typography>*/}
                    {
                        params.map((param) =>
                            <div key={param.id}
                                 style={{
                                     display: "flex",
                                     justifyContent: "center",
                                     alignItems: "center",
                                 }}>
                                <Button disableRipple
                                        disableFocusRipple
                                        fullWidth
                                        variant="text"
                                        color="default"
                                        style={{backgroundColor: "transparent", minWidth: 100, padding: 0}}
                                        onClick={(event: any) => handleCombinedClicks(param.id, event)}>
                                    <Typography variant={"button"}>{param.translation}</Typography>
                                    {param.sortEnum === "desc" ?
                                        <StyledBadge badgeContent={MAXorder > 1 ? param.order : null} color="default">
                                            <ArrowDownwardOutlined style={{margin: 1, color: "grey"}} fontSize="small"/>
                                        </StyledBadge> : param.sortEnum === "asc" ?
                                            <StyledBadge badgeContent={MAXorder > 1 ? param.order : null} color="default">
                                                <ArrowUpwardOutlined style={{margin: 1, color: "grey"}} fontSize="small"/>
                                            </StyledBadge> : null}
                                </Button>
                                <FormControl variant="standard">
                                    <Select variant={"standard"}
                                            value=""
                                            onChange={(event) => handleTouchClick(event.target.value, param.id)}
                                            id={`${param.id}`}
                                            autoWidth={true}
                                            disableUnderline
                                            IconComponent={MoreVertIcon}
                                    >
                                        <MenuItem divider value={"desc"}>
                                            <ArrowDownwardOutlined fontSize="small"/>
                                            Sort desc
                                        </MenuItem>
                                        <MenuItem divider value={"asc"}>
                                            <ArrowUpwardOutlined fontSize="small"/>
                                            Sort asc
                                        </MenuItem>
                                        <MenuItem divider disabled={param.sortEnum === "desc"} value={0}>
                                            <ArrowDownwardOutlined fontSize="small"/>
                                            Add to sort desc
                                        </MenuItem>
                                        <MenuItem divider disabled={param.sortEnum === "asc"} value={1}>
                                            <ArrowUpwardOutlined fontSize="small"/>
                                            Add to sort asc
                                        </MenuItem>
                                        <MenuItem divider disabled={param.sortEnum === "undefined"} value={2}>
                                            <RemoveIcon fontSize="small"/>
                                            Unsort
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                                <Divider orientation="vertical" flexItem/>
                            </div>
                        )
                    }
                    <div>
                        <Button style={{margin: 10}} variant="outlined" size={"medium"} color="primary"
                                onClick={submitSortParams}>Sort</Button>
                        <Button style={{margin: 10}} variant="outlined" size={"medium"} color="secondary"
                                onClick={resetSortParams}>UnSort</Button>
                    </div>
                </div>
                {/*{filterParams !== '' && <h3>{filterParams}</h3>}*/}
            </div>
        )
    }
;

export default MyMultiSort;