import React from 'react';
import { Link } from 'react-router';

export default function Cover() {
  return (
    <div className="cover-wrapper">
      <div className="cover-map" />
      <div className="cover-content">
        <div className="cover-icon">
          <span>yc-extra</span>
        </div>
        <h3>yc-extra</h3>
        <div className="cover-link">
          {/* rel 支持传递 external 与 external nofollow 与 noopener noreferrer */}
          <a
            className="github"
            target="_blank"
            rel="noopener noreferrer"
            href="https://gitee.com/remotesc2/yc-extra"
          >
            Source
          </a>
          <Link className="start" to="/changelog-cn">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
