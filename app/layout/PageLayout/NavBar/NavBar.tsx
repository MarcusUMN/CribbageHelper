import { useNavigate, useLocation } from "react-router";
import { NavLink, Group, Text } from "@mantine/core";
import {
  IconHome,
  IconCalculator,
  IconBrain,
  IconCut,
} from "@tabler/icons-react";
import classes from "./NavBar.module.css";
import React from "react";

type NavItem =
  | {
      type: "link";
      link: string;
      label: string;
      icon: React.FC<{ className?: string; stroke?: number }>;
    }
  | { type: "section"; label: string };

const navItems: NavItem[] = [
  { type: "link", link: "/", label: "Home", icon: IconHome },
  { type: "section", label: "Calculator" },
  {
    type: "link",
    link: "/hand-calculator",
    label: "Hand Calculator",
    icon: IconCalculator,
  },
  {
    type: "link",
    link: "/pegging-calculator",
    label: "Pegging Calculator",
    icon: IconCalculator,
  },
  { type: "section", label: "Probabilities / Analysis" },
  {
    type: "link",
    link: "/hand-optimizer",
    label: "Hand Optimizer",
    icon: IconCut,
  },
  {
    type: "link",
    link: "/cut-probabilities",
    label: "Cut Probabilities",
    icon: IconCut,
  },
  { type: "section", label: "Info" },
  { type: "link", link: "/support", label: "Support", icon: IconBrain },
];

interface NavBarProps {
  drawerOpened?: boolean;
  onLinkClick?: () => void;
}

export const NavBar = ({ drawerOpened, onLinkClick }: NavBarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <React.Fragment>
      {navItems.map((item) => {
        if (item.type === "section") {
          return (
            <Text
              key={item.label}
              size="xs"
              p="sm"
              fw={700}
              c="var(--mantine-color-sectionText-0)"
              style={{
                textTransform: "uppercase",
              }}
            >
              {item.label}
            </Text>
          );
        }

        const Icon = item.icon;
        const isActive = location.pathname === item.link;

        return (
          <NavLink
            key={item.label}
            className={classes.link}
            onClick={() => {
              navigate(item.link);
              if (drawerOpened && onLinkClick) onLinkClick();
            }}
            label={
              <Group gap="sm">
                <Icon
                  className={isActive ? classes.iconActive : classes.icon}
                  stroke={1.5}
                />
                <span>{item.label}</span>
              </Group>
            }
            active={isActive}
          />
        );
      })}
    </React.Fragment>
  );
};
