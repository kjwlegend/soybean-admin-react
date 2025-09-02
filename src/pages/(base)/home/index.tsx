import CardData from "./modules/CardData";
import CreativityBanner from "./modules/CreativityBanner";
import HeaderBanner from "./modules/HeaderBanner";
import LineChart from "./modules/LineChart";
import PieChart from "./modules/PieChart";
import ProjectNews from "./modules/ProjectNews";

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  navigate("/anke-agents");
  return (
    <ASpace className="w-full" direction="vertical" size={[16, 16]}>
      <>等待跳转..</>
      {/* <HeaderBanner />

      <CardData />

      <ARow gutter={[16, 16]}>
        <ACol lg={14} span={24}>
          <LineChart />
        </ACol>
        <ACol lg={10} span={24}>
          <PieChart />
        </ACol>
      </ARow>
      <ARow gutter={[16, 16]}>
        <ACol lg={14} span={24}>
          <ProjectNews />
        </ACol>
        <ACol lg={10} span={24}>
          <CreativityBanner />
        </ACol>
      </ARow> */}
    </ASpace>
  );
};

export default Home;
