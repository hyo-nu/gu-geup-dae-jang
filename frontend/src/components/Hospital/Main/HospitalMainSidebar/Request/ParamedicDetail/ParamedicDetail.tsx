import { useState, useEffect } from 'react';

import { useRecoilState } from "recoil";
import { ItemParaType, ItemRequestAt } from "../ParamedicItem/ParamedicListItem.style";
import {
  CloseDiv,
  DetailItemContainer,
  ItemElapseMin,
  ItemAddr,
  ParamedicDetailContainer,
  ParamedicDetailContent,
  DetailItemBetween,
  ItemLeftTime,
  FilesSection,
  Video,
  Image,
  Audio,
} from "./ParamedicDetail.style";
import A from "/src/components/Commons/Atoms";
import theme from "/src/styles";
import {
  hospitalParmedicRequestList,
  hospitalParmedicTransferList,
  hospitalSelectedRequestItem,
} from "/src/recoils/HospitalAtoms";
import { HospitalResponsePostProps, HospitalTransferItem, ParaRequestItem } from "/src/types/map";
import { timeToString, turmToString } from "/src/constants/function";
import { AGEGROUP, GENDER } from "/src/constants/variable";
import { putHospitalResponse } from "/src/apis/hospital";
import Swal from 'sweetalert2';

export interface FileTypes {
  video: string | null;
  image: string | null;
  voice: string | null;
}

const ParamedicDetail = (props: any) => {
  const [requestList, setRequestList] = useRecoilState(hospitalParmedicRequestList);
  const [transferList, setTransferList] = useRecoilState(hospitalParmedicTransferList);
  const [selectedParaItem, setSelectedParaItem] = useRecoilState(hospitalSelectedRequestItem);
  const [objFiles, setObjFiles] = useState<FileTypes>({ video: null, image: null, voice: null });

  const checkFiles = (fileList: string[]) => {
    const filesObject: FileTypes = { video: null, image: null, voice: null };

    fileList.map((file) => {
      if (!file) return;
      const parts = file.split('.');
      const extension = parts.length > 1 ? parts.pop()?.toLowerCase() : '';
      if (!extension) return;
      if (extension === 'mp4') {
        filesObject.video = file as string | null;
      } else if (extension === 'jpg' || extension === 'png') {
        filesObject.image = file as string | null;
      } else if (extension === 'webm') {
        filesObject.voice = file as string | null;
      }
    });
    setObjFiles(filesObject)
  };

  useEffect(() => {
    if (selectedParaItem !== undefined && selectedParaItem.files) { checkFiles(selectedParaItem.files) }
  }, [selectedParaItem]);

  const getAxiosReturn = async (res: boolean) => {
    if(selectedParaItem === undefined) return undefined
    console.log(res);
    let response;
    if (!res ) {
      response = await Swal.fire({
        title: "거절 사유 입력",
        text: "거절 사유를 입력해주세요.",
        input: "text",
        inputPlaceholder: "거절 사유를 입력해주세요.",
      }).then(async (inputReason) => {
        console.log(inputReason);
        if (inputReason.value != null) {
          const postProps: HospitalResponsePostProps = {
            callingId: selectedParaItem.id,
            status: "REJECTED",
            reason: inputReason.value,
          };
          return await putHospitalResponse(postProps);
        } else {
          const postProps: HospitalResponsePostProps = {
            callingId: selectedParaItem.id,
            status: "REJECTED",
            reason: "사유 없음",
          };
          return await putHospitalResponse(postProps);
        }
      });
    } else {
      const postProps: HospitalResponsePostProps = {
        callingId: selectedParaItem.id,
        status: "APPROVED",
        reason: "",
      };
      response = await putHospitalResponse(postProps);
    }
    return response;
  };

  const clickButton = async (res: boolean) => {
    const response: any = await getAxiosReturn(res);
    if (res) {
      if (response === undefined) {
        // alert("HospitalResponse 실패");
        Swal.fire("병원 응답 실패", "HospitalResponse is undefined", "error");
        return;
      } else if (response.data.isFull) {
        console.log(response);
        // alert("HospitalResponse isFull");
        Swal.fire("병원 잔여 병상 없음", "HospitalResponse isFull", "error");
        setRequestList([]);
        return;
      } else if (requestList !== undefined && selectedParaItem !== undefined) {
        if (res) {
          const newTransferItem: HospitalTransferItem = {
            id: selectedParaItem.id,
            state: "wait",
            data: selectedParaItem,
          };
          if (transferList !== undefined) {
            setTransferList([...transferList, newTransferItem]);
          } else {
            setTransferList([newTransferItem]);
          }
        }
      }
    }
    if (requestList !== undefined && selectedParaItem !== undefined) {
      let nextRequestList = requestList.filter((item: ParaRequestItem) => item.id != selectedParaItem.id);
      setRequestList(nextRequestList);
    }
    if (selectedParaItem !== undefined) {
      setSelectedParaItem(undefined);
    }
  };

  return selectedParaItem && (
    <ParamedicDetailContainer>
      <ParamedicDetailContent>
        <DetailItemContainer>
          <A.DivKtasInfo
            $position="absolute"
            $right="0%"
            $top="0%"
            $ktas={selectedParaItem.ktas.toLowerCase() as "ktas1" | "ktas2" | "ktas3" | "ktas4" | "ktas5" | undefined}
            $width="50px"
            $height="25px"
            $borderRadius="0px 0px 0px 10px"
            $fontSize={theme.font.Small5_12}
          >
            {selectedParaItem.ktas}
          </A.DivKtasInfo>
          <ItemRequestAt>{timeToString(selectedParaItem.createdAt)}</ItemRequestAt>
          <DetailItemBetween>
            <ItemParaType>
              {AGEGROUP[selectedParaItem.ageGroup]} ({GENDER[selectedParaItem.gender]})
            </ItemParaType>
            <ItemElapseMin>요청 대기 {turmToString(selectedParaItem.createdAt)}분 경과</ItemElapseMin>
          </DetailItemBetween>

          <div style={{ width: "90%", margin: "0 auto" }}>
            {selectedParaItem.tags.map((item: string, index: number) => (
              <A.DivTag
                key={index}
                $margin="2px 5px 10px 2px"
                $width="fit-content"
                $height="18px"
                $borderRadius="5px"
                $textAlign="center"
                $padding="2px"
                $fontSize={theme.font.Small5_12}
              >
                {item}
              </A.DivTag>
            ))}
          </div>

          <FilesSection>
            {objFiles.video ? (
              <Video controls>
                <source src={objFiles.video} type="video/mp4" /></Video>
            ) : (<></>)}

            {objFiles.image ? (
              <Image src={objFiles.image}></Image>
            ) : (<></>)}

            {objFiles.voice ? (
              <Audio src={objFiles.voice} controls></Audio>
            ) : (<></>)}
          </FilesSection>
          <ItemAddr>{selectedParaItem.description}</ItemAddr>

          <ItemAddr>{selectedParaItem.address}</ItemAddr>
          <DetailItemBetween>
            <ItemElapseMin>{selectedParaItem.distance} km</ItemElapseMin>
            <ItemLeftTime>{selectedParaItem.duration}분 이내 도착 가능</ItemLeftTime>
          </DetailItemBetween>

          <A.BtnToggle
            $width="50%"
            $height="50px"
            $position="absolute"
            $left="0%"
            $bottom="0%"
            $borderRadius="0px"
            $color={theme.color.pinkDrak}
            $fontSize={theme.font.Small1_16}
            $boxShadow="0 0.2px 0.1px 0px inset"
            onClick={() => clickButton(false)}
          >
            거절
          </A.BtnToggle>

          <A.BtnToggle
            $width="50%"
            $height="50px"
            $position="absolute"
            $right="0%"
            $bottom="0%"
            $borderRadius="0px"
            $color={theme.color.white}
            $fontSize={theme.font.Small1_16}
            $backgroundColor={theme.color.pinkDrak}
            $boxShadow="0 0.2px 0.1px 0px inset"
            onClick={() => clickButton(true)}
          >
            승인
          </A.BtnToggle>
        </DetailItemContainer>
      </ParamedicDetailContent>
      <CloseDiv onClick={props.onclick}>&lt;</CloseDiv>
    </ParamedicDetailContainer>
  );
};

export default ParamedicDetail;