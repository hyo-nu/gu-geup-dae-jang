import ApexCharts from 'apexcharts';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { CharacterRequestData } from '/src/types/chart';
import { AgeType } from '/src/types/report';

const Container = styled.div`
  /* border: 1px solid red; */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 100%;
`;
const ChartHeader = styled.div`
  /* border: 1px solid green; */
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 8%;
  width: 96%;
  padding: 1.8% 2% 0.2% 2%;
`

const Title = styled.div`
  font-size: 2.5vh;
  font-weight: 600;
`

const Chart = styled.div`
  /* border: 1px solid blue; */
  width: 100%;
`;

const CharacterChart = ({ageValue}:{ageValue?: AgeType}) => {
  const chartRef = useRef(null);

  const requestData: CharacterRequestData = {
    'age' : ageValue?.totalCountList,
    'male' : ageValue?.maleCountList,
    'female' : ageValue?.femaleCountList,
  }

  const MaxData = requestData.age?  Math.ceil(Math.max(...requestData.age)/10) * 10 + 10 : 0;

  useEffect(() => {
    const options = {
      // 데이터
      series: [
        {
          name: '연령대',
          data: requestData["age"]
        }, 
        {
          name: '남성',
          data: requestData["male"]
        }, 
        {
          name: '여성',
          data:  requestData["female"]
        }
      ],

      // 차트
      chart: {
        type: 'bar',
        height: '86%',
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        },
      },

      // x축
      xaxis: {
        categories: [
          '영유아', '아동', '청소년', 
          '청년', '중장년', '노인'
        ],
      },

      // y축
      yaxis: {
        min: 0,
        max: MaxData,
        tickAmount: 5,
      },
      
      // 데이터 레이블
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '14px',
          colors: ['black'],
        },
      },

      // 범례
      legend: {
        floating: true,
        position: 'top',
        horizontalAlign: 'right',
        offsetY: -12,
        fontSize: '12%',
        fontWeight : 800,
        markers: {
          width: '9%',
          height: '9%',
        },
      },

      
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded',
          dataLabels: {
            position: 'top'
          }
        },
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },

      tooltip: {
        y: {
          formatter: function (val) {
            return + val + "건"
          }
        }
      }
    };

    const chart = new ApexCharts(chartRef.current, options);
    chart.render();

    // 컴포넌트 언마운트시 차트 제거
    return () => {
      chart.destroy();
    };
  }, []);

  return (
    <Container>
      <ChartHeader>
        <Title>연령대별 응급현황</Title>
      </ChartHeader>
      <Chart ref={chartRef} />
    </Container>
  );
};

export default CharacterChart;
