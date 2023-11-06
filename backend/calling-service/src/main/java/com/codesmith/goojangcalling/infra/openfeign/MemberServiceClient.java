package com.codesmith.goojangcalling.infra.openfeign;

import com.codesmith.goojangcalling.calling.dto.response.HospitalSearchResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "MEMBER-SERVICE")
public interface MemberServiceClient {

    @GetMapping("/member/hospital")
    List<HospitalSearchResponse> searchHospital(
            @RequestParam("latitude") Double latitude,
            @RequestParam("longitude") Double longitude,
            @RequestParam("distance") Double distance);
}
