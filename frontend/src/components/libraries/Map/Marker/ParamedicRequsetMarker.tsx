import { useEffect, useState } from "react";
import { Tmapv3 } from "../Map";
import { ParamedicRequestMarkerContainer } from "./ParamedicRequsetMarker.style";
import { useRecoilState } from "recoil";
import { hospitalSelectedRequestItem } from "../../../../recoils/HospitalAtoms";

function ParamedicRequestMarker(props: any) {
    const [paraRequestMarkers, setParaRequestMarkers] = useState<any[]>([]);
    const [paraRequestItem, setParaRequsetItem] = useRecoilState(hospitalSelectedRequestItem);

    const updateMarker = () => {
        if (props.map !== undefined && props.paraRequestList !== undefined) {
            let next: any[] = []
            for (var i = 0; i < props.paraRequestList.length; i++) {
                var lonlat = new Tmapv3.LatLng(props.paraRequestList[i].latitude, props.paraRequestList[i].longitude);
                // var title = props.paraRequestList[i].name;
                const size = new Tmapv3.Size(30, 30);
                const marker = new Tmapv3.Marker({
                    position: lonlat,
                    draggable: true,
                    map: props.map,
                    // color: positions[i].color,
                    iconSize: size,
                    // icon: props.paraRequestList[i].type,
                    // label: title //Marker의 라벨.
                })
                marker.name = props.paraRequestList[i].id
                const tmp = props.paraRequestList[i]
                marker.on("Click", () => {
                    setParaRequsetItem(tmp)
                });
                // console.log(marker)
                next.push(marker);
            }
            setParaRequestMarkers(next);
        }
    }
    const deleteMarker = () => {
        for (let i = 0; i < paraRequestMarkers.length; i++) {
            paraRequestMarkers[i].setMap(null);
        }
        setParaRequestMarkers([]);
    }

    useEffect(() => {
        if (props.map !== undefined && props.paraRequestList !== undefined) {
            deleteMarker()
            if (paraRequestMarkers.length == 0) updateMarker()
        }
    }, [props]);
    useEffect(() => {
        if (paraRequestItem != undefined)
            props.map.setCenter(new Tmapv3.LatLng(paraRequestItem.latitude, paraRequestItem.longitude));

    }, [paraRequestItem]);

    return (
        <ParamedicRequestMarkerContainer></ParamedicRequestMarkerContainer>
    );

    // return {
    //     paraRequestList,
    //     updateMarker
    // };
}

export default ParamedicRequestMarker;