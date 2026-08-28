import React from 'react';
import {
  Activity,
  Award,
  BadgeDollarSign,
  BookOpen,
  Briefcase,
  Building2,
  CheckCircle2,
  Compass,
  Cpu,
  FileText,
  Globe,
  GraduationCap,
  Heart,
  HeartHandshake,
  HeartPulse,
  Landmark,
  Languages,
  Leaf,
  Lightbulb,
  Megaphone,
  MessageSquare,
  PlusCircle,
  Radio,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Sprout,
  Stethoscope,
  Target,
  Terminal,
  TrendingUp,
  Users,
  Utensils,
  Wheat,
  Zap,
  HelpCircle,
} from 'lucide-react';

interface IconHelperProps {
  name: string;
  className?: string;
}

export const IconHelper: React.FC<IconHelperProps> = ({ name, className = 'w-6 h-6' }) => {
  switch (name) {
    case 'Briefcase':
      return <Briefcase className={className} />;
    case 'TrendingUp':
      return <TrendingUp className={className} />;
    case 'Scale':
      return <Scale className={className} />;
    case 'Landmark':
      return <Landmark className={className} />;
    case 'HeartPulse':
      return <HeartPulse className={className} />;
    case 'Utensils':
      return <Utensils className={className} />;
    case 'GraduationCap':
      return <GraduationCap className={className} />;
    case 'Languages':
      return <Languages className={className} />;
    case 'Sprout':
    case 'Leaf':
      return <Leaf className={className} />;
    case 'Megaphone':
      return <Megaphone className={className} />;
    case 'Cross':
    case 'PlusCircle':
      return <PlusCircle className={className} />;
    case 'Radio':
      return <Radio className={className} />;
    case 'Cpu':
      return <Cpu className={className} />;
    case 'Stethoscope':
      return <Stethoscope className={className} />;
    case 'Building2':
      return <Building2 className={className} />;
    case 'Users':
      return <Users className={className} />;
    case 'ShieldAlert':
      return <ShieldAlert className={className} />;
    case 'BookOpen':
      return <BookOpen className={className} />;
    case 'Globe':
      return <Globe className={className} />;
    case 'FileText':
      return <FileText className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'BadgeDollarSign':
      return <BadgeDollarSign className={className} />;
    case 'Activity':
      return <Activity className={className} />;
    case 'Terminal':
      return <Terminal className={className} />;
    case 'Wheat':
      return <Wheat className={className} />;
    case 'Award':
      return <Award className={className} />;
    case 'ShieldCheck':
      return <ShieldCheck className={className} />;
    case 'HeartHandshake':
      return <HeartHandshake className={className} />;
    case 'Compass':
      return <Compass className={className} />;
    case 'Heart':
      return <Heart className={className} />;
    case 'Lightbulb':
      return <Lightbulb className={className} />;
    case 'MessageSquare':
      return <MessageSquare className={className} />;
    case 'CheckCircle2':
      return <CheckCircle2 className={className} />;
    case 'Target':
      return <Target className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
};
