import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { HomePage } from "./components/HomePage";
import { GovernmentSupport } from "./components/GovernmentSupport";
import { Community } from "./components/Community";
import { DxTools } from "./components/DxTools";
import { MarketPrice } from "./components/MarketPrice";
import { Marketplace } from "./components/Marketplace";
import { ChatPage } from "./components/ChatPage";
import { SignupPage } from "./components/SignupPage";
import { RegisterPage } from "./components/RegisterPage";
import { LoginPage } from "./components/LoginPage";
import { AIAnalysisPage } from "./components/AIAnalysisPage";
import { LandingPage } from "./components/LandingPage";

export const router = createBrowserRouter([
  { path: "/", Component: LandingPage },
  { path: "/signup", Component: SignupPage },
  { path: "/register", Component: RegisterPage },
  { path: "/login", Component: LoginPage },
  { path: "/ai-analysis", Component: AIAnalysisPage },
  {
    path: "/",
    Component: Layout,
    children: [
      { path: "home", Component: HomePage },
      { path: "support", Component: GovernmentSupport },
      { path: "community", Component: Community },
      { path: "tools", Component: DxTools },
      { path: "market-price", Component: MarketPrice },
      { path: "trade", Component: Marketplace },
      { path: "chat", Component: ChatPage },
    ],
  },
]);